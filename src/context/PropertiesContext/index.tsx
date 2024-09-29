"use client"

import * as React from "react"
import {PropertyType} from "@/types/property"

type ResponseType = {
    data: PropertyType[],
    error: Error
} 

type PropertiesContextType = ResponseType

type PropsType = ResponseType & {
    children: React.ReactNode
}

export const PropertiesContext = React.createContext<PropertiesContextType>({} as PropertiesContextType)

export const PropertiesContextProvider = ({ children, ...rest }: PropsType) => {

    return (
        <PropertiesContext.Provider
            value={rest}>
            { children }
        </PropertiesContext.Provider>
    )
}