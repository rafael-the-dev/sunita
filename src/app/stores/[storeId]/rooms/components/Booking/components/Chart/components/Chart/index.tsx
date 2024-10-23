import * as React from "react"
import classNames from "classnames"
import dynamic from "next/dynamic"

import styles from "./styles.module.css"

import { ChartXAxisType } from "@/types/chart";
import { PERIOD } from "@/types"
import { CHART_TYPE, X_AXIS } from "@/app/stores/[storeId]/rooms/components/Booking/components/Chart/components/Filters/types"
import { LANGUAGE } from "@/types/language"

import { RoomsContext as BookingsContext } from "@/app/stores/[storeId]/rooms/context"

import useLanguage from "@/hooks/useLanguage"
import useSearchParams from "@/hooks/useSearchParams"

import { getId } from "@/helpers/id"
import { getBookingsSeries, getDailyXAxis, getPtWeeklyXAxis, getWeeklyXAxis, getMonthlySeries, MONTHS_LIST } from "../../helpers"

const Chart = dynamic(() => import( "@/components/chart/line"), { ssr: false });

const BookingsChart = () => {
    const { bookings: { data }} = React.useContext(BookingsContext)

    const { language } = useLanguage()
    const searchParams = useSearchParams()

    const isEnglish = language === LANGUAGE.ENGLISH

    const dailyXAxis = React.useRef<ChartXAxisType>(getDailyXAxis())
    const monthlyXAxis = React.useRef<ChartXAxisType>({ categories: MONTHS_LIST })
    const weeklyXAxis = React.useRef<ChartXAxisType>(isEnglish ? getWeeklyXAxis() : getPtWeeklyXAxis())

    const list = React.useMemo(
        () => data?.data?.list ?? [],
        [ data ]
    )

    const chart = searchParams.get("chart-type", CHART_TYPE.LINE)
    const xAxis = searchParams.get("x-axis", X_AXIS.DAY) 

    const dailySeries = React.useMemo(
        () => getBookingsSeries(list),
        [ list ]
    )

    const weeklySeries = React.useMemo(
        () => getBookingsSeries(list, PERIOD.WEEK),
        [ list ]
    )

    const monthlySeries = React.useMemo(
        () => getMonthlySeries(list, PERIOD.MONTH),
        [ list ]
    )

    const options = {
        series: {
            [X_AXIS.DAY]: dailySeries,
            [X_AXIS.MONTH]: monthlySeries,
            [X_AXIS.WEEK]: weeklySeries
        }[xAxis],
        type: chart,
        xAxis: {
            [X_AXIS.DAY]: dailyXAxis,
            [X_AXIS.MONTH]: monthlyXAxis,
            [X_AXIS.WEEK]: weeklyXAxis
        }[xAxis]
    }

    return (
        <div className={classNames(`mt-4 overflow-x-auto sm:overflow-hidden`)}>
            <div className={classNames(styles.chartContainer)}>
                <Chart 
                    { ...options }
                    key={getId()}
                />
            </div>
        </div>
    )
}

export default BookingsChart