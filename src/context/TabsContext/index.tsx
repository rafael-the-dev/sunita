"use client"

import * as React from "react"

import { TabType, TabsPropsType } from "./types"

import { getId } from "@/helpers/id"

import TabWrapper from "./Container"

type TabsContextPropsType<T> = { 
    children: React.ReactNode;
    component: React.ReactNode;
    Component?: React.FC;
    initialList?: T[];
}

export const TabsContext = React.createContext<TabsPropsType | null>(null)
TabsContext.displayName = "TabsContext"

export const TabsContextProvider = <T, >({ children, component, Component, initialList }: TabsContextPropsType<T>) => {
    
    const getNewTab = React.useCallback((index: number): TabType => {
        const id = getId()
        
        return {
            component: <TabWrapper key={id} id={id}>{ component }</TabWrapper>,
            id,
            name: `Tab ${index}`
        }
    }, [ component ]);
    
    const [ tabsList, setTabsList ] = React.useState<TabType[]>(() => {
        if(Array.isArray(initialList) && initialList.length > 0) {
            return initialList.map((item, index) => {
                const id = getId();

                return {
                    //@ts-ignore
                    component: <TabWrapper id={id} key={id}><Component initial={item} /></TabWrapper>,
                    id,
                    name: `Tab ${index + 1}`
                }
            })
        }

        return [ getNewTab(1) ]
    })
    const [ activeTab, setActiveTab ] = React.useState<TabType>(() => tabsList[0])

    const addTab = React.useCallback(() => {
        setTabsList(tabs => {
            if(tabs.length === 5) return tabs

            return [
                ...tabs,
                getNewTab(tabs.length + 1)
            ]
        })
    }, [ getNewTab ])

    const activateTab = React.useCallback((id: string) => {
        const tab = tabsList.find((tab) => tab.id === id)
        
        if(tab) setActiveTab(tab)
    }, [ tabsList ])

    const removeTab = React.useCallback((id: string) => {
        
        setTabsList(tabs => {
            if(tabs.length === 1) return tabs

            const tabIndex = tabs.findIndex(tab => tab.id === id)

            setActiveTab(tabs[tabIndex === 0 ? 1 : tabIndex - 1])

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


