import { useContext } from "react"
import classNames from "classnames"

import styles from "./styles.module.css"

import { TABS } from "../Tabs/components/Tab/types"

import { StoresContext } from "../../context"

import useTab from "../Tabs/hooks/useTab"

import PropertyCard from "./components/Card"

const List = () => {
    const { getProperties } = useContext(StoresContext)

    const { isActive } = useTab()

    return (
        <ul className={classNames(styles.list, "flex flex-col gap-y-6", { "hidden": !isActive(TABS.LIST)})}>
            {
                getProperties()
                    .map(property => (
                        <PropertyCard 
                            { ...property }
                            key={property.id}
                        />
                    ))
            }
        </ul>
    )
}

export default List