import { useCallback, useContext, useEffect, useMemo } from "react"
import classNames from "classnames"
import { SchedulerTypes, Scheduler, View } from "devextreme-react/scheduler"

import styles from "./styles.module.css"

import { BookingInfoType } from "@/types/booking"
import {LANGUAGE} from "@/types/language"
import {TABS} from "./components/Chart/components/Filters/types"

import { AppContext } from "@/context/AppContext"
import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext"
import { RoomsContext } from "../../context"

import useLanguage from "@/hooks/useLanguage"
import useSearchParams from "@/hooks/useSearchParams"

import { formatDates } from "@/helpers/date";

import Button from "@/components/shared/button"
import BookingForm from "./components/BookingForm"
import Card from "@/components/shared/report-card"
import Chart from "./components/Chart"
import Filters from "./components/Filters"
import Tab from "./components/Tab"

enum DIALOG_TYPE {
    BOOKING = "booking"
}

const lang = {
    title: {
        [LANGUAGE.ENGLISH]: "Date",
        [LANGUAGE.PORTUGUESE]: "Data"
    },
    buttons: {
        fetchBookings: {
            [LANGUAGE.ENGLISH]: "Fetch bookings",
            [LANGUAGE.PORTUGUESE]: "Pesquisar reservas"
        },
        book: {
            [LANGUAGE.ENGLISH]: "Book",
            [LANGUAGE.PORTUGUESE]: "Reservar"
        }
    }
}

const Booking = () => {
    const searchParams = useSearchParams()

    const { fetchDataRef } = useContext(AppContext)

    const { bookings } = useContext(RoomsContext)
    const { setDialog } = useContext(StaticTabsContext)

    const { language } = useLanguage()

    const bookingsData = bookings?.data
    const bookingsList = bookingsData?.data?.list ?? [];
    const fetchBookingsFuncRef = bookings?.fetchData

    const dialog = searchParams.get("dialog", "") as DIALOG_TYPE;
    const tab = searchParams.get("tab", TABS.SCHEDULER) as TABS;

    const bookingsRange = bookingsList.length > 0 ? formatDates(bookingsList, "checkIn") : "";

    const openDialog = useCallback(
        (value: DIALOG_TYPE) => () => searchParams.setSearchParam("dialog", value),
        [ searchParams ]
    );

    const openBookingDialog = useCallback(
        (payload?: BookingInfoType) => {
            fetchDataRef.current = fetchBookingsFuncRef

            setDialog(
                {
                    header: {
                        title: "Booking"
                    },
                    body: <BookingForm />,
                    payload
                }
            )
        }, 
        [ fetchDataRef, fetchBookingsFuncRef, setDialog ]
    )
    
    const appointmentClickHandler = useCallback(
        (e: SchedulerTypes.AppointmentClickEvent) => { 
            openBookingDialog(e.appointmentData as BookingInfoType)
        },
        [ openBookingDialog ]
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
                                <span className="text-base">
                                    { lang.title[language] }
                                </span>
                                <br/>
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
                <ul className="flex list-none mb-10 px-4">
                    <Tab id={TABS.SCHEDULER}>Scheduler</Tab>
                    <Tab id={TABS.CHART}>Chart</Tab>
                </ul>
                { 
                    tab === TABS.SCHEDULER ?
                        <Scheduler
                            allDayExpr="dayLong"
                            dataSource={bookingsList}
                            currentView="week"
                            descriptionExpr="price.hour"
                            endDateExpr="checkOut"
                            onAppointmentClick={appointmentClickHandler}
                            recurrenceRuleExpr="recurrence"
                            startDateExpr="checkIn"
                            textExpr="name">
                        </Scheduler>
                    :
                        <Chart />
                }
            </div>
            <div className="flex flex-col gap-y-4 items-stretch mt-8 px-2 sm:flex-row-reverse sm:gap-y-0 sm:gap-x-4 md:px-4 ">
                <Button 
                    className="py-2"
                    onClick={openDialog(DIALOG_TYPE.BOOKING)}>
                    { lang.buttons.book[language] }
                </Button>
                <Button
                    className="py-2"
                    onClick={() => bookings?.fetchData({})}>
                    { lang.buttons.fetchBookings[language] }
                </Button>
            </div>
        </div>
    )
}

export default Booking