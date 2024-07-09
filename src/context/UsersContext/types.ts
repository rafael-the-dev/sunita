import { ReactNode } from "react"

import { UserType } from "@/types/user"

export type PropsType = {
    children: ReactNode
}

export type ContextType = {
    getUsers: () => UserType[],
    loading: boolean,
    refetchUsers: () => Promise<void>
}