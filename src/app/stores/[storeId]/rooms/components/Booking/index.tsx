import { useCallback, useContext, useEffect } from "react"
import classNames from "classnames"
import { Scheduler } from "devextreme-react/scheduler"

import styles from "./styles.module.css"

import { AppContext } from "@/context/AppContext"
import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext"
import { RoomsContext } from "../../context"

import useSearchParams from "@/hooks/useSearchParams"

import Button from "@/components/shared/button"
import BookingForm from "./components/BookingForm"

enum DIALOG_TYPE {
    BOOKING = "booking"
}

const Booking = () => {
    const searchParams = useSearchParams()

    const { fetchDataRef } = useContext(AppContext)

    const { bookings } = useContext(RoomsContext)
    const { setDialog } = useContext(StaticTabsContext)

    const bookingsList = bookings?.data ?? [];
    const fetchBookingsFuncRef = bookings?.fetchData

    const dialog = searchParams.get("dialog", "") as DIALOG_TYPE;

    const openDialog = useCallback(
        (value: DIALOG_TYPE) => () => searchParams.setSearchParam("dialog", value),
        [ searchParams ]
    );

    const openBookingDialog = useCallback(
        () => {
            fetchDataRef.current = fetchBookingsFuncRef

            setDialog(
                {
                    header: {
                        title: "Booking"
                    },
                    body: <BookingForm />
                }
            )
        }, 
        [ fetchDataRef, fetchBookingsFuncRef, setDialog ]
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
                    descriptionExpr="room.hourlyPrice"
                    endDateExpr="checkOut"
                    allDayExpr="dayLong"
                    recurrenceRuleExpr="recurrence"
                    startDateExpr="checkIn"
                    textExpr="room.type">
                </Scheduler>
            </div>
            <div className="flex flex-col items-stretch mt-8 px-2 md:px-4 sm:flex-row sm:justify-end">
                <Button
                    className="py-2"
                    onClick={() => bookings?.fetchData({})}>
                    Fetch bookings
                </Button>
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