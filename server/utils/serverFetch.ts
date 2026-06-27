import { cookies } from "next/headers";
import { isTokenExpired, decodeJWT, refreshTokens } from "./auth-helpers";

/**
 * Builds a query object from parameters, converting all values to strings
 * @param baseParams - Base query parameters that are always included
 * @param params - Dynamic parameters to add if they exist
 * @returns Query object ready for URLSearchParams
 */
export function buildQueryObj<T extends Record<string, unknown>>(
  baseParams: Record<string, string> = {},
  params?: T
): Record<string, string> {
  const queryObj: Record<string, string> = { ...baseParams };

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryObj[key] = String(value);
      }
    });
  }

  return queryObj;
}

interface ServerFetchOptions extends RequestInit {
  cache?: "default" | "no-store" | "force-cache";
  revalidate?: number;
  timeout?: number;
}

const serverFetch = async (
  endpoint: string | URL | Request,
  options: ServerFetchOptions = {}
): Promise<Response> => {
  if (!process.env.DOMAIN_URL) {
    throw new Error("DOMAIN_URL environment variable is not set");
  }

  const fullUrl = process.env.DOMAIN_URL + endpoint;

  const {
    cache,
    revalidate,
    timeout,
    headers: customHeaders,
    ...fetchOptions
  } = options;

  const cookieStore = await cookies();

  let currentCookieString = cookieStore.toString();
  const authCookie = cookieStore.get("Authentication")?.value;
  const refreshCookie = cookieStore.get("Refresh")?.value;

  // 1. Check if token is expired before sending the request
  if (refreshCookie && (!authCookie || isTokenExpired(authCookie))) {
    const newAccessToken = await refreshTokens(refreshCookie);
    if (newAccessToken) {
      try {
        cookieStore.set({
          name: "Authentication",
          value: newAccessToken,
          expires: new Date((decodeJWT(newAccessToken)?.exp || 0) * 1000),
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "lax",
        });
        currentCookieString = cookieStore.toString();
      } catch (_e) {
        // Next.js throws an error if cookieStore.set is called inside GET/rendering contexts.
        // We override the Authentication header manually for the outbound fetch to succeed.
        const cookiesMap = new Map<string, string>();
        currentCookieString.split(";").forEach(c => {
          const parts = c.split("=");
          if (parts.length >= 2) {
            cookiesMap.set(parts[0].trim(), parts.slice(1).join("=").trim());
          }
        });
        cookiesMap.set("Authentication", newAccessToken);
        currentCookieString = Array.from(cookiesMap.entries())
          .map(([k, v]) => `${k}=${v}`)
          .join("; ");
      }
    }
  }

  // If the caller provided a FormData body, avoid forcing a Content-Type so
  // the browser/node runtime can set the multipart boundary automatically.
  const isFormData = options.body instanceof FormData;

  // Default configurations optimized for Next.js server-side usage
  const defaultOptions: RequestInit = {
    // Set default headers for better compatibility
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...customHeaders,
      Cookie: currentCookieString,
    },
    // Enable keep-alive for better performance
    keepalive: true,
  };

  // Handle Next.js specific cache options
  const nextOptions: { revalidate?: number; cache?: string } = {};

  if (cache === "no-store") {
    nextOptions.cache = "no-store";
  } else if (cache === "force-cache") {
    nextOptions.cache = "force-cache";
  } else if (revalidate) {
    nextOptions.revalidate = revalidate;
  }

  // Merge options
  const mergedOptions: RequestInit = {
    ...defaultOptions,
    ...fetchOptions,
    headers: {
      ...defaultOptions.headers,
    },
  };

  // Add Next.js specific options if provided
  if (Object.keys(nextOptions).length > 0) {
    mergedOptions.next = {
      ...mergedOptions.next,
      ...nextOptions,
    };
  }

  // Execute standard fetch, optionally handling timeouts
  const executeFetch = async (mergedOpts: RequestInit): Promise<Response> => {
    if (timeout) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(fullUrl, {
          ...mergedOpts,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === "AbortError") {
          throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
      }
    }
    return fetch(fullUrl, mergedOpts);
  };

  let response = await executeFetch(mergedOptions);

  // 2. Self-healing fallback: If response returns 401, try to refresh and retry
  if (response.status === 401 && refreshCookie) {
    const newAccessToken = await refreshTokens(refreshCookie);
    if (newAccessToken) {
      try {
        cookieStore.set({
          name: "Authentication",
          value: newAccessToken,
          expires: new Date((decodeJWT(newAccessToken)?.exp || 0) * 1000),
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "lax",
        });
      } catch (_e) {
        // Safe to ignore in GET paths
      }

      // Rebuild the cookie string manually to ensure the retried request uses the new token
      const cookiesMap = new Map<string, string>();
      cookieStore.toString().split(";").forEach(c => {
        const parts = c.split("=");
        if (parts.length >= 2) {
          cookiesMap.set(parts[0].trim(), parts.slice(1).join("=").trim());
        }
      });
      cookiesMap.set("Authentication", newAccessToken);
      const retryCookieString = Array.from(cookiesMap.entries())
        .map(([k, v]) => `${k}=${v}`)
        .join("; ");

      const retryOptions: RequestInit = {
        ...mergedOptions,
        headers: {
          ...mergedOptions.headers,
          Cookie: retryCookieString,
        },
      };

      response = await executeFetch(retryOptions);
    }
  }

  return response;
};

export default serverFetch;
