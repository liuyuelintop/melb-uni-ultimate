import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected, /admin)
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path.startsWith("/announcements") ||
    path.startsWith("/events") ||
    path.startsWith("/about") ||
    path.startsWith("/contact") ||
    path === "/login" ||
    path === "/unauthorized";

  // Define admin paths that require admin role
  const isAdminPath = path.startsWith("/admin");

  // Define protected paths that require authentication
  const isProtectedPath =
    path.startsWith("/roster") ||
    path.startsWith("/alumni") ||
    path.startsWith("/profile");

  // TEMPORARY: Disable authentication for development
  // TODO: Re-enable when NextAuth is properly configured
  return NextResponse.next();

  // Get the token from the cookies
  const token = request.cookies.get("auth-token")?.value || "";

  // If the path is public, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // If the path is protected and user is not authenticated, redirect to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If the path is admin and user is not admin, redirect to unauthorized
  if (isAdminPath && !isAdmin(token)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

// Helper function to check if user is admin (implement based on your auth system)
function isAdmin(token: string): boolean {
  // TODO: Implement admin check logic
  // This should verify the token and check if the user has admin role
  return false;
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
