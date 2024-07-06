import { createContext } from "react";

import { ContextType, PropsType } from "./types"
import useForm from "./hooks/useForm";

export const UserFormContext = createContext<ContextType>({} as ContextType)

export const UserFormContextProvider = ({ children }: PropsType) => {
    const form = useForm()

    return (
        <UserFormContext.Provider
            value={{
                ...form
            }}>
            { children }
        </UserFormContext.Provider>
    )
}