
import { CredentialsType } from "@/types/login";
import { USER_CATEGORY } from "@/types/user"

import { isSystemEmployee } from "../../system";

export const hasFinancesRouteAccess = (credentials: CredentialsType, pathname: string, ) => {
    return [ USER_CATEGORY.ADMIN, USER_CATEGORY.MANAGER ].includes(credentials.user.category)
}

export const hasUsersRouteAccess = (credentials: CredentialsType, pathname: string, ) => {
    return [ USER_CATEGORY.ADMIN, USER_CATEGORY.MANAGER ].includes(credentials.user.category)
}

export const hasStoreRoutesAccess = (credentials: CredentialsType, pathname: string, ) => {
    if(pathname.match("^/stores/([A-z0-9\-]+|[0-9]+)/[A-Za-z]+$")) {
        const slug = pathname.split("/stores/")[1].split("/")[1]
        
        switch(slug) {
            case "expenses": return hasFinancesRouteAccess(credentials, pathname)
            case "finances": return hasFinancesRouteAccess(credentials, pathname)
            case "users": return hasUsersRouteAccess(credentials, pathname)
        }
    }

    return ![ USER_CATEGORY.SYSTEM_ADMIN, USER_CATEGORY.SYSTEM_MANAGER ].includes(credentials.user.category)
}

export const hasSystemPageAcess = (credentials: CredentialsType, pathname: string) => {
    // If the user is not system Admin or Manager, redirect him to login page
    if(!isSystemEmployee(credentials.user.category)) return false;

    return true
}