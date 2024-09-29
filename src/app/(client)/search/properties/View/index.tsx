"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import classNames from "classnames"

import styles from "../styles.module.css"

import { StoresContextProvider } from "../context"

import Filters from "../components/Filters"
import Footer from "@/common/components/Footer"
import Header from "@/common/components/Header"
import List from "../components/List"
import SearchBox from "../components/Searchbox"
import Tabs from "../components/Tabs"

const MapContainer = dynamic(
    () => import("../components/Map"),
    { ssr: false }
)

const StoresPage = () => {
    return (
        <div>
            <Header />
            <main className={classNames(styles.container, "gap-x-12 items-stretch px-[5%] pt-8 pb-8 xl:flex")}>
                <div className={classNames(styles.filtersContainer, `hidden xl:flex`)}>
                    <Filters />
                </div>
                <div className="bg-white grow py-6 px-4">
                    <SearchBox />
                    <Tabs />
                    <div className="mt-10">
                        <List />
                        <MapContainer />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

const Provider = () => (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[70vh] w-screen">Loading...</div>}>
        <StoresContextProvider>
            <StoresPage />
        </StoresContextProvider>
    </Suspense>
)

export default Provider