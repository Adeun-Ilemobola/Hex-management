import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";


export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  console.log("------- middleware -------");
  const authPage = pathName.startsWith("/login") || pathName.startsWith("/register");
  const protectedPage = pathName.startsWith("/home") || pathName.startsWith("/test");
  const sessionCookie = getSessionCookie(request);
  console.log({
    protectedPage,
    authPage,
    sessionCookie,
    pathName,
  });
  // Handle Stripe webhook
  if (pathName.startsWith("/api/webhooks/stripe")) {
    return NextResponse.next();
  }

  // Handle other API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // If user has session and is on auth pages, redirect to home
  if (authPage && sessionCookie) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // If user has NO session and is on protected pages, redirect to login
  if (protectedPage && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }




  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
