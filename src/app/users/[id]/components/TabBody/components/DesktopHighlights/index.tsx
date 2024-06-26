import { useCallback, useContext } from "react"
import classNames from "classnames"
import Button from "@mui/material/Button"
import Hidden from "@mui/material/Hidden"

import FilterAltIcon from '@mui/icons-material/FilterAlt';

import styles from "./styles.module.css"

import { AnalyticsContext } from "@/context/AnalyticsContext"
import { AnalyticsFiltersContext } from "@/context/AnalyticsFilters";

import Card from "@/components/shared/Highlights/components/Card"
import Carousel from "@/components/shared/Highlights"

const Container = () => {
    const { getAnalytics } = useContext(AnalyticsContext)
    const { onToggleCollapse } = useContext(AnalyticsFiltersContext)

    const toggleHandler = useCallback(() => onToggleCollapse.current?.(), [ onToggleCollapse ])

    return (
        <Carousel className="">
            <Card className={styles.card} label="Sales" value={getAnalytics()?.sales?.total} />
            <Card className={styles.card} label="Expenses" value={getAnalytics()?.expenses.total} />
            <Card className={styles.card} label="Profit" value={getAnalytics()?.profit} />
            <Hidden xlDown>
                <li className={classNames(styles.filterButtonContainer, `h-full`)}>
                    <Button
                        className={classNames(styles.filtersButton, ` 
                            bg-white h-full rounded-md py-6 text-black w-full hover:bg-stone-400`)}
                        onClick={toggleHandler}
                        startIcon={<FilterAltIcon />}>
                        Filters
                    </Button>
                </li>
            </Hidden>
        </Carousel>
    )
}

export default Container