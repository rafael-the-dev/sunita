import { useCallback, useContext, useEffect, useRef } from "react"
import classNames from "classnames"
import { Scheduler } from "devextreme-react/scheduler"

import styles from "./styles.module.css"

import { BookingRoomType } from "@/types/room"

import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext"
import { LoginContext } from "@/context/LoginContext"

import useSearchParams from "@/hooks/useSearchParams"
import useFetch from "@/hooks/useFetch"

import Button from "@/components/shared/button"
import BookingForm from "./components/BookingForm"

enum DIALOG_TYPE {
    BOOKING = "booking"
}

const Booking = () => {
    const searchParams = useSearchParams()

    const { credentials } = useContext(LoginContext)

    const { setDialog } = useContext(StaticTabsContext)

    const { data, fetchData } = useFetch<BookingRoomType[]>(
        {
            url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/rooms/bookings`
        }
    );

    const fetchBookingsFuncRef = useRef(fetchData)

    const bookingsList = data ?? [];

    const dialog = searchParams.get("dialog", "") as DIALOG_TYPE;

    const openDialog = useCallback(
        (value: DIALOG_TYPE) => () => searchParams.setSearchParam("dialog", value),
        [ searchParams ]
    );

    const openBookingDialog = useCallback(
        () => {
            setDialog(
                {
                    header: {
                        title: "Booking"
                    },
                    body: <BookingForm fetchBookingsFuncRef={fetchBookingsFuncRef} />
                }
            )
        }, 
        [ setDialog ]
    )

    useEffect(
        () => {
            if(dialog === DIALOG_TYPE.BOOKING) openBookingDialog()
        },
        [ dialog, openBookingDialog ]
    )

    return (
        <div className="dx-viewport flex flex-col h-full justify-between">
            <div className={classNames(styles.schedulerContainer, `overflow-y-auto`)}>
                <Scheduler
                    dataSource={bookingsList}
                    endDateExpr="checkOut"
                    textExpr="title"
                    allDayExpr="dayLong"
                    recurrenceRuleExpr="recurrence"
                    startDateExpr="checkIn">
                </Scheduler>
            </div>
            <div className="flex flex-col items-stretch px-2 md:px-4 sm:flex-row sm:justify-end">
                <Button 
                    className="py-2"
                    onClick={openDialog(DIALOG_TYPE.BOOKING)}>
                    Book
                </Button>
            </div>
        </div>
    )
}

export default Booking