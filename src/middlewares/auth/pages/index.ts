
import { cookies } from "next/headers";

import { CredentialsType } from "@/types/login";

import { isAuthenticated } from "@/helpers/auth"
import { isSystemEmployee } from "../system";

const hasSystemPageAcess = (pathname: string, credentials: CredentialsType) => {
    // If the user is not system Admin or Manager, redirect him to login page
    if(!isSystemEmployee(credentials.user.category)) return false;

    return true
}

export const hasPageAccess = async (pathname: string) => {
    const isStystemPages = pathname.startsWith("/system");

    const isProtectedPage = pathname.startsWith("/stores") || isStystemPages;
    
    if(isProtectedPage) {
        const result = cookies().get("token");

        if(!result?.value) return false;

        const credentials = await isAuthenticated(result.value);
        
        if(!credentials) return false;

        if(isStystemPages) return (hasSystemPageAcess(pathname, credentials));
    }

    return true
}