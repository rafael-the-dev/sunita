"use client"

import { useContext } from "react"
import classNames from "classnames"

import { TabType } from "@/context/FixedTabsContext/types"

import { FiltersContextProvider } from "@/context/FiltersContext"
import { FixedTabsContext } from "@/context/FixedTabsContext"
import { LoginContext } from "@/context/LoginContext"
import { SalesContextProvider } from "./context"

import { Provider } from "@/components/shared/FixedTabsContainer"

import UnpaidSales from "./views/UnpaidSales"

enum TABS_TYPE {
    SALES = "sales",
    UNPAID_SALES = "unpaid-sales",
}

const tabs = [
    {
        id: TABS_TYPE.SALES,
        name: "sales"
    },
    {
        id: TABS_TYPE.UNPAID_SALES,
        name: "Unpaid sales"
    }
]

const SalesPage = () => {
    const { credentials } = useContext(LoginContext)
    const { getActiveTab } = useContext(FixedTabsContext)

    const activeTab = getActiveTab().id

    return (
        <div className={classNames("px-2 md:px-4 scrollable overflow-x-auto pt-6")}>
            {
                {
                    [TABS_TYPE.SALES]: <div></div>,
                    [TABS_TYPE.UNPAID_SALES]: <UnpaidSales />
                }[activeTab]
            }
        </div>
    )
}

const ProviderContainer = () => (
    <SalesContextProvider>
        <Provider tabs={tabs}>
            <SalesPage />
        </Provider>
    </SalesContextProvider>
);

export default ProviderContainer;