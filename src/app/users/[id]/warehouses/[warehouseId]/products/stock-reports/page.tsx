"use client"

import { useContext } from "react";

import { AnalyticStockReportInfoType, StockReportInfoType } from "@/types/stock";

import { FiltersContextProvider } from "@/context/FiltersContext"
import { LoginContext } from "@/context/LoginContext";

import TabBody from "./components/TabBody";
import TabBodyContainer from "@/components/shared/tab-body-container"

const Container = () => {
    const { credentials } = useContext(LoginContext)

    return (
        <TabBodyContainer 
            component={(
                <FiltersContextProvider<AnalyticStockReportInfoType> 
                    url={`/api/stores/${credentials?.user?.stores[0]?.storeId}/products/stock-reports`}>
                    <TabBody />
                </FiltersContextProvider>
            )} 
        />
    );
}


export default Container;


