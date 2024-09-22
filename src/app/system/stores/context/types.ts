import { ReactNode } from "react"

import { FetchResponseType } from "@/hooks/useFetch/types"
import { FetchResponseType as StoresData } from "@/types"
import { Store } from "@/types/warehouse"

export type StoresContextType = {
    stores: FetchResponseType<StoresData<Store[]>>
}

export type PropsType = {
    children: ReactNode
}