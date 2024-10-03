"use server"

import { ReactNode } from "react"

import { FetchResponseType } from "@/types"
import { PropertyType } from "@/types/property"

import { PropertiesContextProvider } from "@/context/PropertiesContext"

type PropsType = {
    children: ReactNode,
    queryParams: string
}

const PropertiesContainer = async ({ children, queryParams }: PropsType) => {
    const url = process.env.MODE === "PRODUCTION" ? process.env.LIVE_URL : `http://localhost:${process.env.PORT}`

    const res = await fetch(`${url}/api/stores/properties?${queryParams}`)

    const data = await res.json() as FetchResponseType<PropertyType[]>

    const properties = data.data

    return (
        <PropertiesContextProvider
            data={properties}
            error={null}>
            { children }
        </PropertiesContextProvider>
    )
}

export default PropertiesContainer