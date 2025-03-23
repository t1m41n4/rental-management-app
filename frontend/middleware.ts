import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Protect landlord routes
    if (path.startsWith("/landlord") && token?.role !== "landlord") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Protect tenant routes
    if (path.startsWith("/tenant") && token?.role !== "tenant") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/landlord/:path*", "/tenant/:path*"],
};
