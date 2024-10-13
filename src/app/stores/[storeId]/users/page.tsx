"use client"

import { useContext } from "react"
import classNames from "classnames"

import { LANGUAGE } from "@/types/language"
import { TabType } from "@/context/FixedTabsContext/types"

import { FixedTabsContext as StaticTabsContext  } from "@/context/FixedTabsContext"
import { UsersContextProvider } from "@/context/UsersContext"

import { Provider as StaticTabsProvider } from "@/components/shared/FixedTabsContainer"
import { UsersPageContextProvider } from "./context"

import useLanguage from "@/hooks/useLanguage"

import ClientsView from "./views/Clients"
import UsersView from "./views/Users"

enum TABS {
    CLIENTS = "clients",
    USERS = "users"
}

const enTabs: TabType[] = [
    {
        id: TABS.USERS,
        name: "Users"
    },
    {
        id: TABS.CLIENTS,
        name: "Clients"
    }
]

const ptTabs: TabType[] = [
    {
        id: TABS.USERS,
        name: "Usuários"
    },
    {
        id: TABS.CLIENTS,
        name: "Clientes"
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

const ContextProvider = () => {
    const { language } = useLanguage()

    const tabs = language === LANGUAGE.ENGLISH ? enTabs : ptTabs

    return (
        <StaticTabsProvider tabs={tabs}>
            <UsersContextProvider>
                <UsersPageContextProvider>
                    <UsersPage />
                </UsersPageContextProvider>
            </UsersContextProvider>
        </StaticTabsProvider>
    )
}

export default ContextProvider