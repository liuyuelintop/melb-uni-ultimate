import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected, /admin)
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path.startsWith("/announcements") ||
    path.startsWith("/events") ||
    path.startsWith("/about") ||
    path.startsWith("/contact") ||
    path.startsWith("/roster") ||
    path.startsWith("/alumni") ||
    path === "/login" ||
    path === "/signup" ||
    path === "/unauthorized";

  // Define admin paths that require admin role
  const isAdminPath = path.startsWith("/admin");

  // Define protected paths that require authentication
  const isProtectedPath = path.startsWith("/profile");

  // Get the token from the cookies
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    "";

  // If the path is public, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // If the path is protected and user is not authenticated, redirect to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the path is admin and user is not authenticated, redirect to login
  if (isAdminPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For admin paths, check if user has admin role
  if (isAdminPath && token) {
    try {
      const decodedToken = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!decodedToken || decodedToken.role !== "admin") {
        // Redirect non-admin users to unauthorized page
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (error) {
      // If token decoding fails, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
