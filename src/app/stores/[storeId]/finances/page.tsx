"use client"


import TabBody from "./components/TabBody";

import TabBodyContainer from "@/components/shared/tab-body-container"

const FinancesPage = () => {

    return (
        <TabBodyContainer 
            component={
                <TabBody />
            }
        />
    )
}

export default FinancesPage