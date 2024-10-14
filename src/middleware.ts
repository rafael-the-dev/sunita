import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'

import { getToken, isAuthenticated } from "./helpers/auth";
import { isPublicPath } from "./middlewares/api";

export const middleware = async (req: NextRequest) => {
    const { pathname, search } = req.nextUrl
    const params = new URLSearchParams(search)
    
    try {
        if(pathname.startsWith("/") && !pathname.startsWith("/api")) {
            const headers = new Headers(req.headers)
           
            headers.set("current-pathname", pathname)
            headers.set("current-search-params", params.toString())

            const isProtectedPage = pathname.startsWith("/stores") || pathname.startsWith("/system")
            
            if(isProtectedPage) {
                const result = cookies().get("token");

                if(!result?.value) return NextResponse.redirect("http://localhost:3000/login");

                const credentials = await isAuthenticated(result.value);
                
                if(!credentials) return NextResponse.redirect("http://localhost:3000/login");
            }
            
            return NextResponse.next({ headers })
        }

        if(isPublicPath(req)) return NextResponse.next();
        
        const token = getToken(req);
        const isLoggedIn = await isAuthenticated(token);
        
        return isLoggedIn ?  NextResponse.next() : NextResponse.json("User not authenticated", { status: 401 });
    } catch(e) {
        console.error(e.message)

        const isProtectedPage = pathname.startsWith("/stores") || pathname.startsWith("/system")

        if(isProtectedPage) return NextResponse.redirect("http://localhost:3000/login");

        return NextResponse.json("User not authenticated", { status: 401 });
    }
};

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
        "/api/users/:username*",
        "/api/stores/:storeId*",
        "/api/auth/refresh",
        "/stores/:path*",
        "/system/:path*",
        "/login",
        "/search/properties/:path*",
        "/"
    ]
};