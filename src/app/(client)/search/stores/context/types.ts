import { ReactNode } from "react"

import { BaseStore, StoresResponse } from "@/types/warehouse"

export type ContextType = {
    getStores: () => StoresResponse<BaseStore[]>
}

export type PropsType = {
    children: ReactNode
}