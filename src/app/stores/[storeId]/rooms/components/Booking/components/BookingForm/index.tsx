import { FormEvent, useContext, useMemo, useRef } from "react"
import classNames from "classnames"

import styles from "./styles.module.css"

import { BookingInfoType } from "@/types/booking"

import { AppContext } from "@/context/AppContext"
import { BookingContext, BookingContextProvider } from "@/context/BookingContext"
import { LoginContext } from "@/context/LoginContext"
import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext"

import useFetch from "@/hooks/useFetch"

import Alert from "@/components/alert"
import Button from "@/components/shared/button"
import BaseDetails from "./components/BaseDetails"
import Guest from "./components/Guest"
import Payment from "./components/Payment"
import Stepper from "@/components/stepper"

const BookingForm = () => {
    const { fetchDataRef } = useContext(AppContext);
    const { credentials } = useContext(LoginContext);
    const { hasErrors, reset, toString } = useContext(BookingContext);
    const { getDialog } = useContext(StaticTabsContext);

    const payload = getDialog().current?.payload;
    const hasPayload = Boolean(payload);
    const bookingInfo = payload as BookingInfoType;

    const { fetchData, loading } = useFetch(
        {
            autoFetch: false,
            url: `/api/stores/${credentials?.user.stores[0]?.storeId}/properties/bookings/${ hasPayload ? bookingInfo.id : ""}`
        }
    )
    
    const fetchBookingsFuncRef = fetchDataRef;

    const alertProps = useRef({
        description: "",
        severity: "",
        title: ""
    })

    const onClose = useRef<() => void>(null);
    const onOpen = useRef<() => void>(null);
    const resetStepperRef = useRef<() => void>(null);

    const alert = useMemo(
        () => (
            <Alert 
                { ...alertProps.current }
                className={classNames("mb-6", loading)}
                onClose={onClose}
                onOpen={onOpen}
            />
        ), 
        [ loading ]
    )

    const submmitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(loading || hasErrors) return;

        onClose.current?.();

        await fetchData(
            {
                options: {
                    body: toString(),
                    method: hasPayload ? "PUT" : "POST"
                },
                onError(error) {
                    alertProps.current = {
                        description: error.message,
                        severity: "error",
                        title: "Error"
                    }
                },
                async onSuccess(res, data) {
                    alertProps.current = {
                        description: `You have successfully ${ hasPayload ? "updated booking" : "booked"}`,
                        severity: "success",
                        title: "Success"
                    };
                    
                    await fetchBookingsFuncRef.current?.({});

                    resetStepperRef.current?.()

                    reset();
                },
            }
        )

        onOpen.current?.()
    }

    return (
        <form
            className={classNames(styles.form, `px-3 py-4`)}
            onSubmit={submmitHandler}>
            { alert }
            <Stepper
                className={classNames(styles.stepper, "flex flex-col items-stretch justify-between")}
                components={[ <BaseDetails key={0} />, <Guest key={1} />, <Payment key={2} /> ]}
                resetStepperRef={resetStepperRef}
                steps={[ "Base details", "Guest", "Payment" ]} 
                FinishButton={
                    () => (
                        <Button
                            className="py-2"
                            disabled={hasErrors}
                            type="submit">
                            { loading ? "Loading..." : ( hasPayload ? "Update" : "Submit" ) }
                        </Button>
                    )
                }
            />
        </form>
    )
}

const Provider = () => (
    <BookingContextProvider>
        <BookingForm  />
    </BookingContextProvider>
)

export default Provider