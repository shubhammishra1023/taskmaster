import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  
  // Define paths that are considered public
  const publicPaths = ["/", "/login", "/signup"]
  
  // Check if the requested path is a public path
  const isPublicPath = publicPaths.includes(path) || 
                       path.startsWith("/api/") || 
                       path.includes(".")
  
  // Get the session token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  
  // Redirect logic
  const isLoggedIn = !!token
  
  if (isPublicPath && isLoggedIn) {
    // If user is logged in and tries to access login/signup, redirect to dashboard
    if (path === "/login" || path === "/signup") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    // For other public paths, allow access
    return NextResponse.next()
  }
  
  if (!isPublicPath && !isLoggedIn) {
    // Redirect to login if trying to access protected route while not logged in
    return NextResponse.redirect(new URL("/login", req.url))
  }
  
  return NextResponse.next()
}

// Define which paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication endpoints)
     * 2. /_next/* (Next.js internals)
     * 3. /fonts/* (static font files)
     * 4. /images/* (static image files)
     * 5. /favicon.ico, /site.webmanifest (browser assets)
     */
    "/((?!api/auth|_next|fonts|images|favicon.ico|site.webmanifest).*)",
  ],
}