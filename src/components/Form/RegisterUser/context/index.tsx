import { createContext } from "react";

import { ContextType, PropsType } from "./types"
import useForm from "./hooks/useForm";

export const UserFormContext = createContext<ContextType>({} as ContextType)

export const UserFormContextProvider = ({ children, initialUser }: PropsType) => {
    const form = useForm(initialUser)


    return (
        <UserFormContext.Provider
            value={{
                ...form
            }}>
            { children }
        </UserFormContext.Provider>
    )
}