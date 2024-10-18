"use client"

import { useContext } from "react"
import classNames from "classnames"

import { LANGUAGE } from "@/types/language"
import { TabType } from "@/context/FixedTabsContext/types"
import { USER_CATEGORY } from "@/types/user"

import { FixedTabsContext as StaticTabsContext  } from "@/context/FixedTabsContext"
import { LoginContext } from "@/context/LoginContext"

import { Provider as StaticTabsProvider } from "@/components/shared/FixedTabsContainer"
import { SettingsContextProvider } from "./context"

import useLanguage from "@/hooks/useLanguage"

import ProfileView from "./views/Profile"
import StoreView from "./views/Store"

enum TABS {
    PROFILE = "profile",
    STORE = "store"
}

const SettingsPage = () => {
    const { getActiveTab } = useContext(StaticTabsContext)


    /*if(loading) return (
        <h2 className="font-bold text-2xl">Loading...</h2>
    )*/

    return (
        <div className={classNames("scrollable overflow-x-auto pt-8")}>
            {
                {
                    [TABS.PROFILE]: <ProfileView />,
                    [TABS.STORE]: <StoreView />
                }[getActiveTab().id]
            }
        </div>
    )
}

const ContextProvider = () => {
    const { credentials } = useContext(LoginContext)
    const { translate } = useLanguage()

    const isEmployee = credentials?.user?.category === USER_CATEGORY.EMPLOYEE

    const tabs: TabType[] = [
        {
            id: TABS.PROFILE,
            name: translate({ [LANGUAGE.ENGLISH]: "My profile", [LANGUAGE.PORTUGUESE]: "Meu Perfil" })
        },
        ( !isEmployee && {
            id: TABS.STORE,
            name: translate({ [LANGUAGE.ENGLISH]: "Store", [LANGUAGE.PORTUGUESE]: "Store" })
        })
    ]

    return (
        <StaticTabsProvider tabs={tabs}>
            <SettingsContextProvider>
                <SettingsPage />
            </SettingsContextProvider>
        </StaticTabsProvider>
    )
}

export default ContextProvider