import { NextRequest, NextResponse } from "next/server";

import { getToken, isAuthenticated } from "./helpers/auth";
import { isPublicPath } from "./middlewares/api";

export const middleware = async (req: NextRequest) => {
    try {
        if(isPublicPath(req)) return NextResponse.next();
        
        const token = getToken(req);
        const isLoggedIn = await isAuthenticated(token);
        
        return isLoggedIn ?  NextResponse.next() : NextResponse.json("User not authenticated", { status: 401 });
    } catch(e) {
        return NextResponse.json("User not authenticated", { status: 401 });
    }
};

export const config = {
    matcher: [
        "/api/users/:username*",
        "/api/stores/:storeId*",
        "/api/auth/refresh"

    ]
};