"use client"

import { useContext } from "react"

import { TabsContext } from "@/context/TabsContext"

import AddTabButton from "./components/add-tab-button"
import Tab from "./components/tab"

const TabsList = () => {
    const { getTabsList } = useContext(TabsContext)

    return (
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
            <AddTabButton key="add-tab-button" />
        </ul>
    )
}

export default TabsList