import { ReactNode } from "react"

import { FetchResponseType } from "@/hooks/useFetch/types"
import { FetchResponseType as RequestResponseType } from "@/types"
import { Store } from "@/types/warehouse"
import { FeeType, FeesResponseType } from "@/types/fees"

export type StoresContextType = {
    fees: FetchResponseType<RequestResponseType<FeesResponseType>>,
    stores: FetchResponseType<RequestResponseType<Store[]>>
}

export type PropsType = {
    children: ReactNode
}