import { createContext, useCallback, useState } from "react";

import { ContextType, PropsType } from "./types"
import { BaseStore, StoresResponse } from "@/types/warehouse";

export const StoresContext = createContext<ContextType>({} as ContextType)

export const StoresContextProvider = ({ children }: PropsType) => {
    const [ stores, setStores ] = useState<StoresResponse<BaseStore[]>>({ list: [] })

    const getStores = useCallback(
        () => structuredClone(stores),
        [ stores ]
    )

    return (
        <StoresContext.Provider
            value={{
                getStores
            }}>
            { children }
        </StoresContext.Provider>
    )
}