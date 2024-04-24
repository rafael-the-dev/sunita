"use client"

import * as React from "react"
import { v4 as uuidV4 } from "uuid"

import { TabType, TabsPropsType } from "./types"

type TabsContextPropsType = { 
    children: React.ReactNode;
    defaultComponent: React.ReactNode;
}

export const TabsContext = React.createContext<TabsPropsType | null>(null)
TabsContext.displayName = "TabsContext"

export const TabsContextProvider = ({ children,  defaultComponent }: TabsContextPropsType) => {

    const getNewTab = React.useCallback((index: number, component: React.ReactNode): TabType => ({
        component,
        id: uuidV4(),
        name: `Tab ${index}`
    }), [])

    const [ tabsList, setTabsList ] = React.useState<TabType[]>(() => [ getNewTab(1, defaultComponent ) ])
    const [ activeTab, setActiveTab ] = React.useState<TabType>(() => tabsList[0])

    const addTab = React.useCallback(() => {
        setTabsList(tabs => {
            if(tabs.length === 5) return tabs

            return [
                ...tabs,
                getNewTab(tabs.length + 1, defaultComponent)
            ]
        })
    }, [ defaultComponent, getNewTab ])

    const activateTab = React.useCallback((id: string) => {
        const tab = tabsList.find((tab) => tab.id ===id)
        
        if(tab) setActiveTab(tab)
    }, [ tabsList ])

    const removeTab = React.useCallback((id: string) => {
        setTabsList(tabs => {
            if(tabs.length === 1) return tabs

            return tabs.filter(tab => tab.id !== id)
        })
    }, [])

    const getActiveTab = React.useCallback(() => activeTab, [ activeTab ])
    const getTabsList = React.useCallback(() => tabsList, [ tabsList ])

    return (
        <TabsContext.Provider
            value={{
                addTab, activateTab,
                getActiveTab, getTabsList,
                removeTab
            }}>
            { children }
        </TabsContext.Provider>
    )
}


