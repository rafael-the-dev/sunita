"use client"

import classNames from "classnames"

import { FiltersContextProvider } from "@/context/FiltersContext"
import { FixedTabsContext } from "@/context/FixedTabsContext"
import { LoginContext } from "@/context/LoginContext"

import useSearchParams from "@/hooks/useSearchParams"

import { Provider } from "@/components/shared/FixedTabsContainer"

import StoresView from "./views"

enum TABS {
    STORES = "stores"
}

const tabs = [ 
    {
        name: "Stores",
        id: TABS.STORES
    }
]

const StoresPage = () => {
    const searchParams = useSearchParams()

    const tab = searchParams.get("tab", TABS.STORES)

    return (
        <div className={classNames("scrollable overflow-x-auto px-4 pt-6")}>
            {
                {
                    [TABS.STORES]: <StoresView />
                }[tab]
            }
        </div>
    )
}

const ProviderContainer = () => (
    <Provider tabs={tabs}>
        <StoresPage />
    </Provider>
);

export default ProviderContainer;