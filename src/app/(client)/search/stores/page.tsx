"use client"

import { useContext } from "react"
import classNames from "classnames"

import styles from "./styles.module.css"

import { StoresContext, StoresContextProvider } from "./context"

import Filters from "./components/Filters"
import List from "./components/List"
import SearchBox from "./components/Searchbox"
import Tabs from "./components/Tabs"

const StoresPage = () => {
    const { getStores } = useContext(StoresContext)

    return (
        <div>
            <main className={classNames(styles.container, "gap-x-12 items-stretch px-[5%] pt-8 pb-8 lg:flex")}>
                <div className={classNames(styles.filtersContainer, `hidden lg:flex`)}>
                    <Filters />
                </div>
                <div className="bg-white grow py-6 px-4">
                    <SearchBox />
                    <Tabs />
                    <div className="mt-10 md:flex">
                        <List />
                    </div>
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