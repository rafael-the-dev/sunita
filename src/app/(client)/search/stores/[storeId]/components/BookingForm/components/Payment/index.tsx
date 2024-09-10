import { ChangeEvent, useCallback, useContext, useMemo } from "react"

import { BOOKING_STATUS } from "@/types/booking"

import { BookingContext } from "@/context/BookingContext"
import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext"

import { getList } from "@/helpers"

import Button from "@/components/shared/button"
import PaymentMethod from "@/components/shared/payment-method"
import Select from "@/components/shared/combobox"
import Typography from "./components/Typography"

const statusList = getList(BOOKING_STATUS)
    .filter(status => status.value !== BOOKING_STATUS.CANCELLED)

const PaymentContainer = () => {
    const { getDialog } = useContext(StaticTabsContext)

    const {
        booking,

        addPaymentMethod,
        changePaymentMethodId, changePaymentMethodValue,
        changeStatus,
        getPayment,
        removePaymentMethod
    } = useContext(BookingContext)

    const hasChanges = getPayment().changes > 0;
    const showRemainingAmount =  getPayment().remainingAmount > 0 &&  getPayment().remainingAmount < booking.totalPrice;

    const hasPayload = Boolean(getDialog().current?.payload)

    const changeStatusHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => changeStatus(e.target.value as BOOKING_STATUS),
        [ changeStatus ]
    )

    const bookingStatus = booking.status

    const statusSelect = useMemo(
        () => (
            <div className="flex">
                 <Select 
                    className="mb-0 w-full sm:w-1/2"
                    label="Status"
                    list={statusList}
                    onChange={changeStatusHandler}
                    value={bookingStatus}
                />
            </div>
        ),
        [ bookingStatus, changeStatusHandler ]
    )

    return (
        <div className="flex flex-col items-stretch justify-between">
            <div className="flex flex-col gap-y-6 items-stretch">
                {
                    hasPayload && statusSelect
                }
                <div>
                    {
                        getPayment()
                            .paymentMethods
                            .map(paymentMethod => (
                                <PaymentMethod
                                    { ...paymentMethod } 
                                    key={paymentMethod.id}
                                    addPaymentMethod={addPaymentMethod}
                                    changePaymentMethodId={changePaymentMethodId}
                                    changePaymentMethodValue={changePaymentMethodValue}
                                    getPayment={getPayment}
                                    removePaymentMethod={removePaymentMethod}
                                />
                            ))
                    }
                </div>
                <Button
                    className="block mt-4 mx-auto py-2"
                    onClick={addPaymentMethod}>
                    Add payment method
                </Button>
            </div>
            <div className="flex flex-col items-end mt-16 mb-3">
                <Typography 
                    classes={{ root: "text-2xl md:text-3xl", value: "font-bold ml-3" }}
                    text="Total"
                    value={ booking.totalPrice }
                />
                { 
                    showRemainingAmount && (
                        <Typography 
                            classes={{ root: "text-red-600 text-md md:text-xl", value: "font-semibold ml-3" }}
                            text="Mising"
                            value={ getPayment().remainingAmount }
                        />         
                    )
                }
                { 
                    hasChanges && (
                        <Typography 
                            classes={{ root: "text-yellow-600 text-md md:text-xl", value: "font-semibold ml-3" }}
                            text="Changes"
                            value={ getPayment().changes }
                        />         
                    )
                }
            </div>
        </div>
    )
}

export default PaymentContainer