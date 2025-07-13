import NextAuth from "next-auth";
import { auth } from "./auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";

const roleRoutes = {
  admin: ["/admin"],
  partner: ["/partner"],
  student: ["/student"],
};

const publicRoutes = ["/"];
const authRoutes = ["/login", "/register"];
const apiAuthPrefix = "/api/auth";

export const { auth: middleware } = NextAuth(authConfig);

export default auth(async (req) => {
  console.log("Middleware: ", req.url);
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = path.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);

  // 1. Handle API routes first
  if (isApiAuthRoute) return NextResponse.next();

  // 2. Handle auth routes for logged-in users
  if (isAuthRoute) {
    if (isLoggedIn) {
      const redirectPath = getRoleRedirectPath(req.auth?.user?.role);
      return NextResponse.redirect(new URL(redirectPath, nextUrl));
    }
    return NextResponse.next();
  }

  // 3. Handle public routes
  if (isPublicRoute) return NextResponse.next();

  // 4. Authentication check
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL(`/login`));
  }

  // 5. Authorization check
  const userRole = req.auth?.user?.role;
  if (!userRole || !isAuthorizedRoute(userRole, path)) {
    const redirectPath = getRoleRedirectPath(userRole);
    return NextResponse.redirect(new URL(redirectPath, nextUrl));
  }

  // 6. Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Content-Security-Policy", "default-src 'self'");

  return response;
});

// Helper functions
function isAuthorizedRoute(role: string, path: string): boolean {
  return (
    roleRoutes[role as keyof typeof roleRoutes]?.some((route) =>
      path.startsWith(route)
    ) || false
  );
}

function getRoleRedirectPath(role?: string): string {
  return role && role in roleRoutes
    ? roleRoutes[role as keyof typeof roleRoutes][0]
    : "/login";
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
