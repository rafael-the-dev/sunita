"use client"

import { useContext } from "react"

import { StoresContext, StoresContextProvider } from "./context"

import List from "./components/List"
import SearchBox from "./components/Searchbox"
import Tabs from "./components/Tabs"

const StoresPage = () => {
    const { getStores } = useContext(StoresContext)

    return (
        <div>
            <main className="px-2 pt-6 pb-8 md:px-4">
                <div>
                    <SearchBox />
                    <Tabs />
                    <List />
                </div>
            </main>
        </div>
    )
}

const Provider = () => (
    <StoresContextProvider>
        <StoresPage />
    </StoresContextProvider>
)

export default Provider