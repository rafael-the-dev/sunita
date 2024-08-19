"use client"

import { useContext } from "react"
import classNames from "classnames"

import { TabType } from "@/context/FixedTabsContext/types"

import { FixedTabsContext as StaticTabsContext  } from "@/context/FixedTabsContext"
import { UsersContextProvider } from "@/context/UsersContext"

import { Provider as StaticTabsProvider } from "@/components/shared/FixedTabsContainer"

import ClientsView from "./views/Clients"
import UsersView from "./views/Users"

enum TABS {
    CLIENTS = "clients",
    USERS = "users"
}

const tabs: TabType[] = [
    {
        id: TABS.USERS,
        name: "Users"
    },
    {
        id: TABS.CLIENTS,
        name: "Clients"
    }
]

const UsersPage = () => {
    const { getActiveTab } = useContext(StaticTabsContext)


    /*if(loading) return (
        <h2 className="font-bold text-2xl">Loading...</h2>
    )*/

    return (
        <div className={classNames("scrollable overflow-x-auto pt-8")}>
            {
                {
                    [TABS.CLIENTS]: <ClientsView />,
                    [TABS.USERS]: <UsersView />
                }[getActiveTab().id]
            }
        </div>
    )
}

const ContextProvider = () => (
    <StaticTabsProvider tabs={tabs}>
        <UsersContextProvider>
            <UsersPage />
        </UsersContextProvider>
    </StaticTabsProvider>
)

export default ContextProvider