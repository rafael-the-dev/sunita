"use server"

import { ReactNode } from "react"

import { FetchResponseType } from "@/types"
import { PropertyType } from "@/types/property"

import { PropertiesContextProvider } from "@/context/PropertiesContext"

type PropsType = {
    children: ReactNode,
    queryParams: { [key: string]: string | string[] } 
}

const PropertiesContainer = async ({ children, queryParams }: PropsType) => {
    const res = await fetch("http://localhost:3000/api/stores/properties")

    const data = await res.json() as FetchResponseType<PropertyType[]>

    const properties = data.data

    console.log(queryParams)
    //console.log(new )

    return (
        <PropertiesContextProvider
            data={properties}
            error={null}>
            { children }
        </PropertiesContextProvider>
    )
}

export default PropertiesContainer