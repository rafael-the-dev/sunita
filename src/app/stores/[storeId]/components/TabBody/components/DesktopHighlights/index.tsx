import { useCallback, useContext } from "react"
import classNames from "classnames"
import Button from "@mui/material/Button"
import Hidden from "@mui/material/Hidden"

import FilterAltIcon from '@mui/icons-material/FilterAlt';

import styles from "./styles.module.css"

import { AppContext } from "@/context/AppContext"
import { AnalyticsContext } from "@/context/AnalyticsContext"
import { AnalyticsFiltersContext } from "@/context/AnalyticsFilters";

import lang from "./lang.json"

import Card from "@/components/shared/Highlights/components/Card"
import Carousel from "@/components/shared/Highlights"

const Container = () => {
    const { language } = useContext(AppContext)
    const { getAnalytics } = useContext(AnalyticsContext)
    const { onToggleCollapse } = useContext(AnalyticsFiltersContext)

    const toggleHandler = useCallback(() => onToggleCollapse.current?.(), [ onToggleCollapse ])

    return (
        <Carousel className="">
            <Card className={styles.card} label={ lang["sales"][language]} value={getAnalytics()?.sales?.total} />
            <Card className={styles.card} label={ lang["expenses"][language] } value={getAnalytics()?.expenses.total} />
            <Card className={styles.card} label={ lang["profit"][language]} value={getAnalytics()?.profit} />
            <Hidden xlDown>
                <li className={classNames(styles.filterButtonContainer, `h-full`)}>
                    <Button
                        className={classNames(styles.filtersButton, ` 
                            bg-white h-full rounded-md py-6 text-black w-full hover:bg-stone-400`)}
                        onClick={toggleHandler}
                        startIcon={<FilterAltIcon />}>
                        { lang["filters"][language] }
                    </Button>
                </li>
            </Hidden>
        </Carousel>
    )
}

export default Container