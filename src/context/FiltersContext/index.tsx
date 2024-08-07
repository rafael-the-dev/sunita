import { createContext } from "react"

import { FiltersContextType, PropsTypes } from "./types"

import useFetch from "@/hooks/useFetch"

export const FiltersContext = createContext<FiltersContextType<any> | null>(null)


export const FiltersContextProvider = <T, >({ autoFetch, children, list, refetchData, url }: PropsTypes<T>) => {

    const hasList = Boolean(list)

    const { data, fetchData, loading } = useFetch<T>({
        autoFetch: autoFetch,
        url
    })

    return (
        <FiltersContext.Provider
            value={{
                data: hasList ? list : data,
                fetchData: hasList ? refetchData : fetchData,
                loading,
                url
            }}>
            { children }
        </FiltersContext.Provider>
    )
}


