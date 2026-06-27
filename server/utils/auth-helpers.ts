import * as jose from "jose";

export interface JWTPayload {
  userId: string;
  iat: number;
  exp: number;
}

/**
 * Decodes the payload of a JWT token without verifying signature.
 * Safe for Edge Runtime.
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    return jose.decodeJwt(token) as JWTPayload;
  } catch (error) {
    console.error("JWT decoding failed:", error);
    return null;
  }
}

/**
 * Returns true if the token is missing, malformed, or past its expiration.
 */
export function isTokenExpired(token: string | undefined | null): boolean {
  if (!token) return true;
  const decoded = decodeJWT(token);
  if (!decoded) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp <= now;
}

/**
 * Contacts the backend auth refresh endpoint using the refresh token,
 * returning the new access token if successful.
 */
export async function refreshTokens(refreshTokenValue: string): Promise<string | null> {
  try {
    const domainUrl = process.env.DOMAIN_URL;
    if (!domainUrl) {
      console.error("DOMAIN_URL environment variable is not set");
      return null;
    }

    const response = await fetch(`${domainUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: `Refresh=${refreshTokenValue}`,
      },
    });

    if (!response.ok) {
      console.error("Refresh token request failed with status:", response.status);
      return null;
    }

    const setCookieHeader = response.headers.get("set-cookie");
    if (!setCookieHeader) {
      console.error("No set-cookie header received from refresh response");
      return null;
    }

    // Extract the new Authentication cookie value
    const regex = new RegExp(`Authentication=([^;]+)`);
    const match = setCookieHeader.match(regex);
    const newAccessToken = match ? match[1] : null;

    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    return null;
  }
}
