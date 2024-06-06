import { createContext } from "react"

import { FiltersContextType, PropsTypes } from "./types"

import useFetch from "@/hooks/useFetch"

export const FiltersContext = createContext<FiltersContextType<any> | null>(null)


export const FiltersContextProvider = <T, >({ children, url }: PropsTypes) => {

    const { data, fetchData, loading } = useFetch<T>({
        autoFetch: true,
        url
    })

    return (
        <FiltersContext.Provider
            value={{
                data,
                fetchData,
                loading,
                url
            }}>
            { children }
        </FiltersContext.Provider>
    )
}


