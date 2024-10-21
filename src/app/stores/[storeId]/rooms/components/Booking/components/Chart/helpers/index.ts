import currency from "currency.js"
import moment from "moment"

import {BookingInfoType} from "@/types/booking"
import { PERIOD, SerieType} from "@/types"
import { ChartSerieType } from "@/types/chart"

type GroupedBookings = {
    month: string,
    list: BookingInfoType[],
}

export const getDailyXAxis = () => {
    let categories = []
    
    for(let i = 1; i <= 31; i++) { 
        categories.push(i)
    } 

    return {
        categories
    }
}

export const groupBookingsByMonth = (list: BookingInfoType[], period: PERIOD) => {
    const mapper = new Map<string, BookingInfoType[]>()

    list.forEach(booking => {
        const month = moment(booking.date).format(PERIOD.MONTH)
        const mappedMonth = mapper.get(month)

        if(mappedMonth) {
            mappedMonth.push(booking)
        } else {
            mapper.set(month, [ booking ])
        }
    })

    const group: GroupedBookings[] = mapper
        .entries()
        .map(
            ([ month, list ]) => {
                return {
                    list,
                    month
                }
            }
        ).toArray()
    
    return group
}

export const getDailySeries = (list: BookingInfoType[], period?: PERIOD): ChartSerieType[] => {
    const groups = groupBookingsByMonth(list, period)

    const mapper = new Map<string, Map<string, number>>()

    groups.forEach(
        ({ list, month }) => {
            const monthMapper  = new Map<string, number>()

            mapper.set(month, monthMapper)

            for(let i = 1; i <= 31; i++) {
                const day = i.toString()

                list.forEach(
                    booking => {
                        const bookingDay = moment(booking.date).format(PERIOD.DAY)

                        if(day === bookingDay) {
                            const amount = monthMapper.get(day) ?? 0

                            const totalAmount = currency(amount).add(booking.totalPrice).value

                            monthMapper.set(day, totalAmount)
                        }
                    }
                )

                if(!monthMapper.has(day)) monthMapper.set(day, 0)
            }
        }
    )

    const series: ChartSerieType[] = mapper
        .entries()
        .map(
            ([ month, monthMapper ]) => {
                return {
                    data: monthMapper
                        .entries()
                        .map(
                            ([ day, totalAmount ]) => totalAmount
                        )
                        .toArray(),
                    name: month
                }
            }
        )
        .toArray()

    return series
}

export const getMonthlySeries = (list: BookingInfoType[], period: PERIOD): SerieType[] => {
    const groups = groupBookingsByMonth(list, period)

    return groups
        .map(
            ({ list, month }) => {
                const totalAmount = list.reduce(
                    (prevValue, currentBooking) => currency(prevValue).add(currentBooking.totalPrice).value,
                    0
                )

                return {
                    period: month,
                    totalAmount
                }
            }
        )
}