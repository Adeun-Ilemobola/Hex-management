import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const Rount = {
  auth: ["/login", "/register" ,"/"],
  main: ["/home"],
};

export async function middleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  console.log("------- middleware -------");
 
  const isAuthentication = Rount.auth.some((route) => pathName.startsWith(route));
  const isMain = Rount.main.some((route) => pathName.startsWith(route));

   const sessionCookie = getSessionCookie(request);

   console.log({
    isAuthentication,
    isMain,
    sessionCookie,
    pathName

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
