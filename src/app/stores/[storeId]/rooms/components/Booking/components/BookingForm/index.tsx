import { FormEvent, useContext, useEffect, useMemo, useRef } from "react"
import classNames from "classnames"

import styles from "./styles.module.css"

import { BookingContext, BookingContextProvider } from "@/context/BookingContext"
import { LoginContext } from "@/context/LoginContext"

import useFetch from "@/hooks/useFetch"

import Alert from "@/components/alert"
import Button from "@/components/shared/button"
import BaseDetails from "./components/BaseDetails"
import Guest from "./components/Guest"
import Payment from "./components/Payment"
import Stepper from "@/components/stepper"

const BookingForm = () => {
    const { credentials } = useContext(LoginContext)
    const { hasErrors, reset, toString } = useContext(BookingContext)

    const { fetchData, loading } = useFetch(
        {
            autoFetch: false,
            url: `/api/stores/${credentials?.user.stores[0]?.storeId}/rooms/bookings`
        }
    )

    const alertProps = useRef({
        description: "",
        severity: "",
        title: ""
    })

    const onClose = useRef<() => void>(null)
    const onOpen = useRef<() => void>(null)
    const resetStepperRef = useRef<() => void>(null)

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

        onClose.current?.()

        await fetchData(
            {
                options: {
                    body: toString(),
                    method: "POST"
                },
                onError(error) {
                    alertProps.current = {
                        description: error.message,
                        severity: "error",
                        title: "Error"
                    }
                },
                onSuccess(res, data) {
                    alertProps.current = {
                        description: "You have successfully booked",
                        severity: "success",
                        title: "Success"
                    };

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
                            { loading ? "Loading..." : "Submit" }
                        </Button>
                    )
                }
            />
        </form>
    )
}

const Provider = () => (
    <BookingContextProvider>
        <BookingForm />
    </BookingContextProvider>
)

export default Provider