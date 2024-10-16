
import { CredentialsType } from "@/types/login";
import { MethodType } from "@/types";
import { USER_CATEGORY } from "@/types/user"

import { isSystemEmployee } from "../system";

type PropsType = { 
    credentials: CredentialsType, 
    method: MethodType,
    pathname: string
}

type HelperPropsType = PropsType & {
    category: USER_CATEGORY
}

const hasStoresMiddleAccess = (category: USER_CATEGORY) => {
    return [ USER_CATEGORY.ADMIN, USER_CATEGORY.MANAGER].includes(category)
}

const hasStoresRoutesAccess = ({ category, method }: HelperPropsType) => {
    if(category === USER_CATEGORY.CLIENT || method === "DELETE") return false

    switch(method) {
        case "POST": return isSystemEmployee(category)
        case "PUT": return isSystemEmployee(category) || hasStoresMiddleAccess(category)
    }

    return true
}

const hasStoreRouteAccess = ({ category, method, pathname }: HelperPropsType) => {
    if(category === USER_CATEGORY.CLIENT) return false

    if(pathname.match("^/api/stores/([A-z0-9\-]+|[0-9]+/users)$")) {
        if(method === "GET") return true

        return hasStoresMiddleAccess(category)
    }

    if(pathname.match("^/api/stores/([A-z0-9\-]+|[0-9]+/expenses|finances)$")) return hasStoresMiddleAccess(category)

    switch(method) {
        case "DELETE": return isSystemEmployee(category)
        case "PUT": return isSystemEmployee(category) || hasStoresMiddleAccess(category)
    }

    return true
}

export const hasRouteAccess = (props: PropsType) => {
    const { credentials, pathname } = props

    const { category } = credentials.user
    
    if(pathname.match("^/api/stores/fees+$")) return isSystemEmployee(category)
    if(pathname.match("^/api/stores/{0,1}$")) return hasStoresRoutesAccess({ ...props, category })
    if(pathname.match("^/api/stores/([A-z0-9\-]+|[0-9]+)$")) return hasStoreRouteAccess({ ...props, category })
    
    return true
}