"use client"

import { AnalyticsExpenseType } from "@/types/analytics";

import { FiltersContextProvider } from "@/context/FiltersContext"

import TabBody from "./components/TabBody";
import TabBodyContainer from "@/components/shared/tab-body-container"

const Container = () => (
    <TabBodyContainer 
        component={(
            <FiltersContextProvider<AnalyticsExpenseType> url="/api/stores/12345/analytics/expenses">
                <TabBody />
            </FiltersContextProvider>
        )} 
    />
);

export default Container;


