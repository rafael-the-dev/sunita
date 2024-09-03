"use client"

import { AnalyticsExpenseType } from "@/types/analytics";

import { FiltersContextProvider } from "@/context/FiltersContext"

import TabBody from "./components/TabBody";
import TabBodyContainer from "@/components/shared/tab-body-container"
import { useContext } from "react";
import { LoginContext } from "@/context/LoginContext";

const Container = () => {
    const { credentials } = useContext(LoginContext)
    
    return (
        <TabBodyContainer 
            component={(
                <FiltersContextProvider<AnalyticsExpenseType> url={`/api/stores/${credentials?.user?.stores[0]?.storeId}/analytics/expenses`}>
                    <TabBody />
                </FiltersContextProvider>
            )} 
        />
    );
}

export default Container;


