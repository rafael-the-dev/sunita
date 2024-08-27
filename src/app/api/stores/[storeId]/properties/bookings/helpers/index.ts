import moment from "moment"

import { resetTime, toISOString } from "@/helpers/date"

export const getDateFilter = (startDate: string, endDate: string) => {
    let start = moment(startDate)
    let end = moment(endDate)

    const currentDate = moment(Date.now())
    currentDate.date(1)

    if(!startDate) {
        const date = moment(currentDate)

        resetTime(date)

        start = date
    }

    if(!endDate) {
        const date = moment(currentDate)

        date.add(1, "month")
        date.subtract(1, "day")

        date.hours(23)
        date.minutes(59)
        date.seconds(59)

        end = date
    }

    return {
        $gte: toISOString(start),
        $lte: toISOString(end),
    }

}