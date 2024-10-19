
import { CredentialsType } from "@/types/login"
import { BaseUserType, USER_CATEGORY } from "@/types/user"

export const isClientUser = (user: BaseUserType) => {
    return !user || user.category === USER_CATEGORY.CLIENT
}

export const getCategories = (credentials: CredentialsType) => {
    const category = credentials?.user?.category

    switch(category) {
        case USER_CATEGORY.CLIENT: return Object.values(USER_CATEGORY.CLIENT)
        case USER_CATEGORY.EMPLOYEE: return Object.values(USER_CATEGORY.EMPLOYEE)
    }
    
    if([ USER_CATEGORY.ADMIN, USER_CATEGORY.MANAGER ].includes(category)) {
        return Object.values([ USER_CATEGORY.EMPLOYEE, USER_CATEGORY.ADMIN, USER_CATEGORY.MANAGER ])
    }

    return Object
        .values(USER_CATEGORY)
}