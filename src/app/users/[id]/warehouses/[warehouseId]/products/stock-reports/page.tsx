"use client"

import { AnalyticStockReportInfoType, StockReportInfoType } from "@/types/stock";

import { FiltersContextProvider } from "@/context/FiltersContext"

import TabBody from "./components/TabBody";
import TabBodyContainer from "@/components/shared/tab-body-container"

const Container = () => (
    <TabBodyContainer 
        component={(
            <FiltersContextProvider<AnalyticStockReportInfoType> url="/api/users/rafaeltivane/warehouses/12345/products/stock-reports">
                <TabBody />
            </FiltersContextProvider>
        )} 
    />
);


export default Container;


