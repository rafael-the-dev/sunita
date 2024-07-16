import { useCallback, useContext, useEffect } from "react"

import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext"
import useSearchParams from "@/hooks/useSearchParams"

import Button from "@/components/shared/button"
import BookingForm from "./components/BookingForm"

enum DIALOG_TYPE {
    BOOKING = "booking"
}

const Booking = () => {
    const searchParams = useSearchParams()

    const { setDialog } = useContext(StaticTabsContext)

    const dialog = searchParams.get("dialog", "") as DIALOG_TYPE

    const openDialog = useCallback(
        (value: DIALOG_TYPE) => () => searchParams.setSearchParam("dialog", value),
        [ searchParams ]
    )

    const openBookingDialog = useCallback(
        () => {
            setDialog(
                {
                    header: {
                        title: "Booking"
                    },
                    body: <BookingForm />
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
        <div className="flex flex-col h-full justify-between">
            <div></div>
            <div className="flex flex-col items-stretch sm:flex-row sm:justify-end">
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