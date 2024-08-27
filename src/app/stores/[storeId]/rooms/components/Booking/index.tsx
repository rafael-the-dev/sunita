import { useCallback, useContext, useEffect, useMemo } from "react"
import classNames from "classnames"
import { Scheduler, View } from "devextreme-react/scheduler"

import styles from "./styles.module.css"

import { AppContext } from "@/context/AppContext"
import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext"
import { RoomsContext } from "../../context"

import useSearchParams from "@/hooks/useSearchParams"

import { formatDates } from "@/helpers/date";

import Button from "@/components/shared/button"
import BookingForm from "./components/BookingForm"
import Card from "@/components/shared/report-card"
import Filters from "./components/Filters"

enum DIALOG_TYPE {
    BOOKING = "booking"
}

const Booking = () => {
    const searchParams = useSearchParams()

    const { fetchDataRef } = useContext(AppContext)

    const { bookings } = useContext(RoomsContext)
    const { setDialog } = useContext(StaticTabsContext)

    const bookingsData = bookings?.data
    const bookingsList = bookingsData?.data?.list ?? [];
    const fetchBookingsFuncRef = bookings?.fetchData

    const dialog = searchParams.get("dialog", "") as DIALOG_TYPE;

    const bookingsRange = bookingsList.length > 0 ? formatDates(bookingsList, "checkIn") : "";

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
            <div className={classNames(styles.schedulerContainer, `flex flex-col items-stretch overflow-y-auto`)}>
                <div className="items-stretch mb-6 px-3 md:flex">
                    <Card>
                        <div>
                            <Card.Title>
                                <span className="text-base">Date</span><br/>
                                { bookingsRange  }
                            </Card.Title>
                        </div>
                        <div>
                            <Card.Description>
                                { bookingsData?.data?.total } MT
                            </Card.Description>
                        </div>
                    </Card>
                    <Filters />
                </div>
                <Scheduler
                    allDayExpr="dayLong"
                    dataSource={bookingsList}
                    currentView="week"
                    descriptionExpr="price.hour"
                    endDateExpr="checkOut"
                    recurrenceRuleExpr="recurrence"
                    startDateExpr="checkIn"
                    textExpr="name">
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