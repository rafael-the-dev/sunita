import { ReactNode } from "react"

export enum TABS {
    LIST = "list",
    MAP = "map"
}

export type PropsType = {
    children: ReactNode,
    id: TABS
}