import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const Rount = {
  auth: ["/login", "/register", "/"],
  main: ["/home"],
};

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  console.log("------- middleware -------");

  const isAuthentication = Rount.auth.some((route) => pathName.startsWith(route));
  const isMain = Rount.main.some((route) => pathName.startsWith(route));
  const sessionCookie = getSessionCookie(request);
  const envTest = {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID,
    REDDIT_CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    // ...add more if needed
  };

  console.log({
    isAuthentication,
    isMain,
    sessionCookie,
    pathName,


    // envTest,
    // requestUrl: request.url,
    // requestPathname: request.nextUrl.pathname,
    // requestSearchParams: request.nextUrl.searchParams.toString(),
    // requestHeaders: Object.fromEntries(request.headers.entries()),
    // requestMethod: request.method,
    

  });
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }
  if (!sessionCookie && isMain && pathName !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in and trying to access auth pages like Login/Register
  if (sessionCookie && isAuthentication && pathName !== "/home") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs", // Required for auth.api usage in middleware
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
