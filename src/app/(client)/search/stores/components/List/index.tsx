import { useContext } from "react"
import classNames from "classnames"

import styles from "./styles.module.css"

import { TABS } from "../Tabs/components/Tab/types"

import { StoresContext } from "../../context"

import useTab from "../Tabs/hooks/useTab"

import StoreCard from "./components/Card"

const List = () => {
    const { getStores } = useContext(StoresContext)

    const { isActive } = useTab()

    return (
        <ul className={classNames(styles.list, "flex flex-col gap-y-4", { "hidden md:flex": !isActive(TABS.LIST)})}>
            {
                getStores()
                    .list
                    .map(store => (
                        <StoreCard 
                            { ...store }
                            key={store.id}
                        />
                    ))
            }
        </ul>
    )
}

export default List