import * as React from "react"
import classNames from "classnames"
import dynamic from "next/dynamic"

import styles from "./styles.module.css"

import { X_AXIS } from "@/app/stores/[storeId]/rooms/components/Booking/components/Chart/components/Filters/types"

import { RoomsContext as BookingsContext } from "@/app/stores/[storeId]/rooms/context"

import useSearchParams from "@/hooks/useSearchParams"

import { getDailySeries, getDailyXAxis, getMonthlySeries } from "../../helpers"

const Chart = dynamic(() => import( "@/components/chart/line"), { ssr: false });

const BookingsChart = () => {
    const { bookings: { data }} = React.useContext(BookingsContext)

    const searchParams = useSearchParams()

    const dailyXAxis = React.useMemo(
        () => getDailyXAxis(),
        []
    )

    const list = data?.data?.list ?? []

    const chart = "LINE"
    const xAxis = searchParams.get("x-axis", X_AXIS.DAY) 

    const options = {
        series: {
            [X_AXIS.DAY]: getDailySeries(list),
            //"WEEK": getSeries(weeklySalesStats)
        }[xAxis],
        type: {
            "BAR": "bar",
            "LINE": "line"
        }[chart],
        xAxis: {
            [X_AXIS.DAY]: dailyXAxis,
            //"WEEK": weekXAxis
        }[xAxis]
    }

    return (
        <div className={classNames(styles.container, `mt-4`)}>
            <Chart 
                { ...options }
            />
        </div>
    )
}

export default BookingsChart