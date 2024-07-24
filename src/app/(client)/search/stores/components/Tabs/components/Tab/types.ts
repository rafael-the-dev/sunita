import { ReactNode } from "react"

export enum TABS {
    LIST = "list",
    MAP = "map"
}

export type PropsType = {
    activeTab: TABS,
    children: ReactNode,
    id: TABS
}