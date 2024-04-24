'use client'

import { useContext } from "react"

import { SalesContextProvider } from "@/context/SalesContext"
import { TabsContext, TabsContextProvider } from "@/context/TabsContext"
import { SaleContextProvider } from "@/context/SalesContext/context/SaleContext"

import TabBody from "./components/TabBody"
import TabsList from "@/components/shared/tabs-list"

const SalesPage = () => {
    const { getActiveTab } = useContext(TabsContext)

    return (
        <main>
            <TabsList />
            { getActiveTab().component }
        </main>
    )
}

const ContextWrapper = () => (
    <SalesContextProvider>
        <TabsContextProvider defaultComponent={<SaleContextProvider><TabBody /></SaleContextProvider>}>
            <SalesPage />
        </TabsContextProvider>
    </SalesContextProvider>
)

export default ContextWrapper