import { cookies } from "next/headers";
import { cache } from "react";
import { redirect, RedirectType } from "next/navigation";
import { decodeJWT, JWTPayload } from "./auth-helpers";


export async function storeSecureSession(name: string, token: string) {
  try {
    const { exp } = decodeJWT(token) as JWTPayload;
    // Store JWT in a cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: name,
      value: token,
      expires: new Date(exp * 1000),
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
    });

    return true;
  } catch (error) {
    console.error("Error creating session:", error);
    return false;
  }
}

// Get current session from JWT
export const getAccessToken = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("Authentication")?.value;

  return token;
});

export const isLoggedIn = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("Authentication")?.value;

  return !!accessToken;
};

export const protectedRoute = async () => {
  const isAuthenticated = await isLoggedIn();
  if (!isAuthenticated) return redirect("/auth", RedirectType.replace);
};
