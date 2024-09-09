import * as React from "react"
import classNames from "classnames"

import styles from "./styles.module.css"

import { BookingsResponseType } from "@/types/booking"
import { FetchResponseType } from "@/hooks/useFetch/types"

import useFetch from "@/hooks/useFetch"

import Scheduler from "@/components/Scheduler"

type PropsType = FetchResponseType<BookingsResponseType> & { storeId: string }

const Bookings = ({ data, fetchData }: PropsType) => {

    const bookings = data?.list ?? []

    return (
        <div className={classNames(styles.bookingsContainer, "searchPropertyBookings mt-4 mb-6 overflow-y-auto")}>
            <Scheduler 
                list={bookings}
            />
        </div>
    )
}

export default Bookings