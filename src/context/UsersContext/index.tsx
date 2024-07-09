import { createContext, useCallback, useContext } from "react"

import { ContextType, PropsType } from "./types"
import { UserType } from "@/types/user"

import { LoginContext } from "../LoginContext"

import useFetch from "@/hooks/useFetch"
import useSearchParams from "@/hooks/useSearchParams"

export const UsersContext = createContext<ContextType>({} as ContextType)

const isIncluded = (value:string, searchValue: string) => {
    return value.toLowerCase().includes(searchValue.toLowerCase())
} 

export const UsersContextProvider = ({ children }: PropsType) => {
    const { credentials } = useContext(LoginContext)

    const { data, fetchData, loading } = useFetch<UserType[]>({
        url: `/api/stores/${ credentials?.user?.stores[0]?.storeId }/users`
    })

    const searchParams = useSearchParams();

    const position = searchParams.get("position", "")
    const searchParam = searchParams.get("search", "");

    const getUsers = useCallback(() => {
        if(!data) return [];

        if(searchParam.trim()) return data.filter(user => {
            //value is in...
            const isInFullName = isIncluded(`${user.firstName} ${user.lastName}`, searchParam);
            const isInUsername = isIncluded(user.username, searchParam);

            return isInFullName || isInUsername;
        })

        if(position) return data.filter(user => user.stores[0]?.category === position);

        return data;
    }, [ data, position, searchParam ]);

    const refetchUsers = useCallback(
        async () => {
            await fetchData({
                path: `/api/stores/${ credentials?.user?.stores[0]?.storeId }/users`,
            })
        },
        [ credentials, fetchData ]
    )

    return (
        <UsersContext.Provider
            value={{
                getUsers,
                loading,

                refetchUsers
            }}
            >
            { children }
        </UsersContext.Provider>
    )
}