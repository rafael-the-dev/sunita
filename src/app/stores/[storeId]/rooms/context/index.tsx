import { createContext, useCallback, useContext } from "react"

import { ContextType, PropsType } from "./types"

import { LoginContext } from "@/context/LoginContext"
import { RoomType } from "@/types/room"

import useFetch from "@/hooks/useFetch"

export const RoomsContext = createContext<ContextType>({} as ContextType)

export const RoomsContextProvider = ({ children }: PropsType) => {
    const { credentials } = useContext(LoginContext)

    const { data, loading, fetchData } = useFetch<RoomType[]>(
        {
            url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/rooms`
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