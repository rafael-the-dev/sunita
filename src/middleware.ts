import { NextRequest, NextResponse } from "next/server";

import { MethodType } from "./types";

import { getToken, isAuthenticated } from "./helpers/auth";
import { hasPageAccess } from "./middlewares/auth/pages";
import { isPublicPath } from "./middlewares/api";
import { hasRouteAccess } from "./middlewares/auth/api";
import { redirect } from "./helpers/auth";

export const middleware = async (req: NextRequest) => {
    const { pathname, search } = req.nextUrl
    const params = new URLSearchParams(search)
    
    try {
        if(pathname.startsWith("/") && !pathname.startsWith("/api")) {
            const headers = new Headers(req.headers)
           
            headers.set("current-pathname", pathname)
            headers.set("current-search-params", params.toString())

            return await hasPageAccess(pathname) ? NextResponse.next({ headers }) : redirect()
        }

        if(isPublicPath(req)) return NextResponse.next();
        
        const token = getToken(req);
        const credentials = await isAuthenticated(token);
        
        if(Boolean(credentials) && hasRouteAccess({ credentials, pathname, method: req.method as MethodType })) {
            return NextResponse.next() 
        }

        return NextResponse.json("User not authenticated", { status: 401 });
    } catch(e) {
        console.error(e.message)

        const isProtectedPage = pathname.startsWith("/stores") || pathname.startsWith("/system")

        if(isProtectedPage) return redirect();

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