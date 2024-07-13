"use client"

import { useContext } from "react"

import { FixedTabsContext } from "@/context/FixedTabsContext"

import Tab from "./components/tab"

const TabsList = () => {
    const { getTabsList } = useContext(FixedTabsContext)

    return (
        <div className="px-2 md:px-4">
            <ul className="flex ">
                {
                    getTabsList().map(tab => (
                        <Tab 
                            key={tab.id}
                            id={tab.id}
                            label={tab.name}
                        />
                    ))
                }
            </ul>
        </div>
    )
}

export default TabsList