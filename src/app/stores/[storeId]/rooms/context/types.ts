import { ReactNode } from "react"

import { FetchDataFuncType, FetchResponseType } from "@/hooks/useFetch/types"
import { RoomType } from "@/types/room";
import { PropertyType } from "@/types/property";
import { BookingInfoType } from "@/types/booking";

export type ContextType = {
    bookings: FetchResponseType<BookingInfoType[]>
    getProperties: () => PropertyType[];
    fetchRooms: FetchDataFuncType;
    loading: boolean;
}

export type PropsType = {
    children: ReactNode;
}