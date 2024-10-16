
import { cookies } from "next/headers";

import { CredentialsType } from "@/types/login";

import { isAuthenticated } from "@/helpers/auth"
import { isSystemEmployee, isStoreEmployee } from "../system";
import { hasFinancesRouteAccess, hasUsersRouteAccess } from "./helpers";

const hasStorePageAcess = (pathname: string, credentials: CredentialsType) => {
    // If the user is not system Admin or Manager, redirect him to login page
    if(!isStoreEmployee(credentials.user.category)) return false;

    if(pathname.match("^/api/stores/[A-z0-9\-]+/[A-Za-z]+$")){
        const slug = pathname.split("/api/stores/")[1].split("/")[1]

        switch(slug) {
            case "expenses": return hasFinancesRouteAccess(credentials, pathname)
            case "finances": return hasFinancesRouteAccess(credentials, pathname)
            case "users": return hasUsersRouteAccess(credentials, pathname)
        }
    }

    return true
}


const hasSystemPageAcess = (pathname: string, credentials: CredentialsType) => {
    // If the user is not system Admin or Manager, redirect him to login page
    if(!isSystemEmployee(credentials.user.category)) return false;

    return true
}

export const hasPageAccess = async (pathname: string) => {
    const isStystemPages = pathname.startsWith("/system");
    const isStorePages = pathname.startsWith("/stores")

    const isProtectedPage = isStorePages || isStystemPages;
    
    if(isProtectedPage) {
        const result = cookies().get("token");

        if(!result?.value) return false;

        const credentials = await isAuthenticated(result.value);
        
        if(!credentials) return false;

        if(isStystemPages) return hasSystemPageAcess(pathname, credentials);

        if(isStorePages) return hasStorePageAcess(pathname, credentials)
    }

    return true
}