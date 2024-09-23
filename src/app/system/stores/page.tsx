"use client"

import { useContext } from "react"
import classNames from "classnames"

import { FiltersContextProvider } from "@/context/FiltersContext"
import { FixedTabsContext } from "@/context/FixedTabsContext"
import { LoginContext } from "@/context/LoginContext"
import { StoresContext } from "./context"

import useSearchParams from "@/hooks/useSearchParams"

import { Provider } from "@/components/shared/FixedTabsContainer"
import { StoresContextProvider } from "./context"

import FeesView from "./views/SubscriptionsFees"
import StoresView from "./views"

enum TABS {
    FEES = 'fees',
    STORES = "stores"
}

const tabs = [ 
    {
        name: "Stores",
        id: TABS.STORES
    },
    {
        name: "Fees",
        id: TABS.FEES
    }
]

const StoresPage = () => {
    const { fees } = useContext(StoresContext)
    const searchParams = useSearchParams()

    const tab = searchParams.get("tab", TABS.STORES)

    const feesList = fees?.data?.data?.list ?? []

    return (
        <div className={classNames("scrollable overflow-x-auto px-4 pt-6")}>
            {
                {
                    [TABS.FEES]: <FiltersContextProvider autoFetch={false} list={feesList} refetchData={fees.fetchData} url="/api/stores/fees"><FeesView /></FiltersContextProvider>,
                    [TABS.STORES]: <StoresView />
                }[tab]
            }
        </div>
    )
}

const ProviderContainer = () => (
    <StoresContextProvider>
        <Provider tabs={tabs}>
            <StoresPage />
        </Provider>
    </StoresContextProvider>
);

export default ProviderContainer;