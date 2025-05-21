import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
 

const Rount ={
    auth:["/Login" , "/Register"],
    main:["/Home"]
}
export async function middleware(request: NextRequest) {
    const pathName= request.nextUrl.pathname;
    const isAuthentication = Rount.auth.some(route => pathName.includes(route));
    const isMain = Rount.main.some(route => pathName.includes(route));
    const session = await auth.api.getSession({
        headers: await headers()
    })
 
    if(!session && isMain ) {
        return NextResponse.redirect(new URL("/Login", request.url));
    }
    if(session && isAuthentication ) {
        return NextResponse.redirect(new URL("/Home", request.url));
    }

 
    return NextResponse.next();
}
 
export const config = {
  runtime: "nodejs",
  matcher: [ "/Home" , "/Login" , "/Register"], // Apply middleware to specific routes
};