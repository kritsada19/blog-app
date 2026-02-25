import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Uint8Array for jose
// NOTE: In production you MUST set JWT_SECRET. In development a placeholder
// is used to avoid crashes, but behavior is intentionally less strict.
const envSecret = process.env.JWT_SECRET;
const JWT_SECRET = new TextEncoder().encode(envSecret ?? "dev-secret");

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // If running in production and no secret is configured, refuse to proceed
  if (!envSecret && process.env.NODE_ENV === "production") {
    // Redirect to login (don't leak secrets). Admins should set JWT_SECRET.
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Restrict admin area to users with role === 'ADMIN'
    if (pathname.startsWith("/admin")) {
      // Keep payload typing minimal — only inspect `role` safely
      const role = (payload as { role?: unknown })?.role;
      if (typeof role === "string" && role === "ADMIN") {
        return NextResponse.next();
      }
      // If not admin, send to home instead of exposing admin routes
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Allow dashboard and other matched routes after successful verify
    return NextResponse.next();
  } catch (err) {
    // Avoid logging tokens/secrets — log minimal info for debugging
    // If helpful for debugging locally, developer can enable full logging.
    console.warn("JWT verification failed or token invalid.",
      err instanceof Error ? err.message : String(err)
    );
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
