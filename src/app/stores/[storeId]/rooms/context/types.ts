import { ReactNode } from "react"

import { FetchDataFuncType, FetchResponseType } from "@/hooks/useFetch/types"
import { FetchResponseType as RequestResponseType } from "@/types";
import { PropertyType } from "@/types/property";
import { BookingsResponseType } from "@/types/booking";

export type ContextType = {
    bookings: FetchResponseType<RequestResponseType<BookingsResponseType>>,
    getProperties: () => PropertyType[];
    fetchRooms: FetchDataFuncType;
    loading: boolean;
}

export type PropsType = {
    children: ReactNode;
}