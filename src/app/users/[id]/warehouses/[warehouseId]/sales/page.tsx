'use client'

import { SalesContextProvider } from "@/context/SalesContext"
import { SaleContextProvider } from "@/context/SalesContext/context/SaleContext"

import { getItem } from "@/helpers/local-storage"

import TabBody from "./components/TabBody"
import TabBodyContainer from "@/components/shared/tab-body-container";
import { CartType } from "@/types/cart"
import { ProductInfoType } from "@/types/product"

const ContextProvider = ({ initial }) => (
    <SaleContextProvider initial={initial}>
        <TabBody />
    </SaleContextProvider>
)

const Container = () => {

    const list = getItem<CartType<ProductInfoType>[]>("carts")
    
    return (
        <SalesContextProvider>
            <TabBodyContainer 
                component={(
                    <SaleContextProvider>
                        <TabBody />
                    </SaleContextProvider>
                )}
                Component={ContextProvider} 
                initialList={list}
            />
        </SalesContextProvider>
    )
};

export default Container