import { createContext, useCallback, useContext } from "react"

import { ContextType, PropsType } from "./types"

import { RoomType } from "@/types/room"

import useFetch from "@/hooks/useFetch"

export const RoomsContext = createContext<ContextType>({} as ContextType)

export const RoomsContextProvider = ({ children, url }: PropsType) => {
    const { data, loading, fetchData } = useFetch<RoomType[]>(
        {
            url
        }
    )

    const getRooms = useCallback(
        () => data ?? [], 
        [ data ]
    )

    return (
        <RoomsContext.Provider
            value={{
                fetchRooms: fetchData,
                getRooms,
                loading,
            }}>
            { children }
        </RoomsContext.Provider>
    )
}