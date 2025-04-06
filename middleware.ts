import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import CryptoJS from "crypto-js";

const SECRET_KEY = "TEST"; // Must match `storage.ts`

export function middleware(req: NextRequest) {
  const encryptedCookie = req.cookies.get("userDetails")?.value;

  // Redirect to login if no user is authenticated
  if (!encryptedCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Decrypt userDetails cookie
    const bytes = CryptoJS.AES.decrypt(encryptedCookie, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    // Extract the access token and decode it
    const accessToken = decryptedData?.accessToken;
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
    const userRole = decodedToken?.role;

    // Define allowed roles for each protected route
    const protectedRoutes: Record<string, string[]> = {
      "/dashboard/Administrator": ["ADMIN", "MODERATOR"],
      "/dashboard/freelancer": ["FREELANCER"],
      "/dashboard/client": ["CLIENT"],
    };

    // Check if the user is allowed to access the requested page
    for (const route in protectedRoutes) {
      if (req.nextUrl.pathname.startsWith(route)) {
        if (!protectedRoutes[route].includes(userRole)) {
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }
    }

    // Redirect based on role if accessing `/`
    if (req.nextUrl.pathname === "/") {
      const roleRedirects: Record<string, string> = {
        ADMIN: "/dashboard/Administrator",
        MODERATOR: "/dashboard/Administrator",
        FREELANCER: "/dashboard/freelancer",
        CLIENT: "/dashboard/client",
      };
      return NextResponse.redirect(new URL(roleRedirects[userRole] || "/unauthorized", req.url));
    }
  } catch (error) {
    console.error("Error decrypting userDetails in middleware:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"], // Protect dashboard routes
};
