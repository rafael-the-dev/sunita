

import { USER_CATEGORY } from "@/types/user"

export const isSystemEmployee = (category: USER_CATEGORY) => {
    return [ USER_CATEGORY.SYSTEM_ADMIN, USER_CATEGORY.SYSTEM_MANAGER ].includes(category)
}