
import { BaseUserType, USER_CATEGORY} from "@/types/user"

export const isClientUser = (user: BaseUserType) => {
    return !user || user.category === USER_CATEGORY.CLIENT
}