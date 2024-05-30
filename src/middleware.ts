import { NextRequest, NextResponse } from "next/server";

import { getToken, isAuthenticated } from "./helpers/auth";

export const middleware = async (req: NextRequest) => {
    const token = getToken(req);
    const isLoggedIn = await isAuthenticated(token)
    
    if(isLoggedIn) return NextResponse.next();
    else return NextResponse.json("User not authenticated", { status: 401 });
};

export const config = {
    matcher: [
        "/api/users/:username*",
        "/api/auth/refresh"

    ]
};