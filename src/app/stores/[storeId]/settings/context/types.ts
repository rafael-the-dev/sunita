import { ReactNode } from "react"

import { FetchResponseType } from "@/hooks/useFetch/types"
import { FetchResponseType as ResponseType } from "@/types"
import { Store } from "@/types/warehouse"
import { User as UserType } from "@/types/user"

export type SettingsContextType = {
    profile: FetchResponseType<UserType>,
    store: FetchResponseType<ResponseType<Store>>
}

export type PropsType = {
    children: ReactNode
}