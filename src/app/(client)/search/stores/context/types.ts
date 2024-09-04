import { ReactNode } from "react"

import {PropertyType} from "@/types/property"

export type ContextType = {
    getProperties: () => PropertyType[]
}

export type PropsType = {
    children: ReactNode
}