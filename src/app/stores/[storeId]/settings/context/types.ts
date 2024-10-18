import { ReactNode } from "react"

import { FetchResponseType } from "@/hooks/useFetch/types"
import { FetchResponseType as ResponseType } from "@/types"
import { Store } from "@/types/warehouse"

export type SettingsContextType = {
    store: FetchResponseType<ResponseType<Store>>
}

export type PropsType = {
    children: ReactNode
}