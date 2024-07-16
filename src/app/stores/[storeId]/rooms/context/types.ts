import { ReactNode } from "react"

import { FetchDataFuncType } from "@/hooks/useFetch/types"
import { RoomType } from "@/types/room";

export type ContextType = {
    getRooms: () => RoomType[];
    fetchRooms: FetchDataFuncType;
    loading: boolean;
}

export type PropsType = {
    children: ReactNode;
}