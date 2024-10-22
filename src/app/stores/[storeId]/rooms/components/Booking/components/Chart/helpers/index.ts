import currency from "currency.js"
import moment from "moment"

import {BookingInfoType} from "@/types/booking"
import { MONTHS } from "@/types/date"
import { PERIOD, SerieType} from "@/types"
import { ChartSerieType } from "@/types/chart"

type GroupedBookings = {
    month: string,
    list: BookingInfoType[],
}

const monthlyBookingsMapper = new Map<string, BookingInfoType[]>()

export const MONTHS_LIST = Object.values(MONTHS)

export const getWeeklyXAxis = () => (
    {
        categories: [ "Sun", "Mon", "Tus", "Wed", "Thu", "Fri", "Sat" ]
    }
)

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
                monthlyBookingsMapper.set(month, list)

                return {
                    list,
                    month
                }
            }
        ).toArray()
    
    return group
}

export const getBookingsSeries = (list: BookingInfoType[], period: PERIOD.DAY | PERIOD.WEEK = PERIOD.DAY): ChartSerieType[] => {
    const groups = groupBookingsByMonth(list, period)

    const isDay = period === PERIOD.DAY;

    const mapper = new Map<string, Map<string, number>>();
    const xAxisList: string[] | number[] = isDay ? getDailyXAxis().categories : getWeeklyXAxis().categories;
    const PERIOD_FORMAT = isDay ? "D" : "ddd";

    groups.forEach(
        ({ list, month }) => {
            const monthMapper  = new Map<string, number>();

            mapper.set(month, monthMapper);

            xAxisList.forEach(
                (category) => {
                    const currentPeriod = category.toString();
                    
                    const totalAmount = list.reduce(
                        (prevValue, booking) => {
                            const bookingPeriod = moment(booking.date).format(PERIOD_FORMAT);
                            
                            if(currentPeriod !== bookingPeriod) return prevValue;

                            const totalAmount = currency(prevValue).add(booking.totalPrice).value;

                            return totalAmount;
                        },
                        0
                    )

                    monthMapper.set(currentPeriod, totalAmount)
                }
            )
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

export const getMonthlySeries = (list: BookingInfoType[], period: PERIOD): ChartSerieType[] => {
    groupBookingsByMonth(list, period)

    const data =  MONTHS_LIST
        .map(
            month => {
                const list = monthlyBookingsMapper.get(month)

                if(!list) return 0

                return list.reduce(
                    (preValue, currentBooking) => currency(preValue).add(currentBooking.totalPrice).value,
                    0
                )
            }
        )


    return [
        {
            data,
            name: "2024"
        }
    ]
    
}