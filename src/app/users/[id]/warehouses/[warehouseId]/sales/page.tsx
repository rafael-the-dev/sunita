'use client'

import { SalesContextProvider } from "@/context/SalesContext"
import { SaleContextProvider } from "@/context/SalesContext/context/SaleContext"

import TabBody from "./components/TabBody"
import TabBodyContainer from "@/components/shared/tab-body-container"

const Container = () => (
    <SalesContextProvider>
        <TabBodyContainer component={<SaleContextProvider><TabBody /></SaleContextProvider>} />
    </SalesContextProvider>
);

export default Container