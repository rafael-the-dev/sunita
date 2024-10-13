import { ChangeEvent, useCallback, useContext, useMemo } from "react"

import { BOOKING_STATUS } from "@/types/booking"

import { BookingContext } from "@/context/BookingContext"
import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext"

import lang from "@/lang/payment.json"

import { getList } from "@/helpers"

import useLanguage from "@/hooks/useLanguage"

import Payment from "@/components/Container/Payment"
import Select from "@/components/shared/combobox"
import Typography from "./components/Typography"

const statusList = getList(BOOKING_STATUS)
    .filter(status => status.value !== BOOKING_STATUS.CANCELLED)

const PaymentContainer = () => {
    const { getDialog } = useContext(StaticTabsContext)

    const {
        booking,

        addPaymentMethod,
        changePaymentMethodId, changePaymentMethodValue, changePaymentMethodTransactionIdValue,
        changeStatus,
        getPayment,
        removePaymentMethod
    } = useContext(BookingContext)

    const { language } = useLanguage()

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
                    label={ lang["status"][language] }
                    list={statusList}
                    onChange={changeStatusHandler}
                    value={bookingStatus}
                />
            </div>
        ),
        [ bookingStatus, changeStatusHandler, language ]
    )

    return (
        <div className="flex flex-col items-stretch justify-between">
            <div className="flex flex-col gap-y-6 items-stretch">
                {
                    hasPayload && statusSelect
                }
               <div>
                    <Payment 
                        addPaymentMethod={addPaymentMethod}
                        changePaymentMethodId={changePaymentMethodId}
                        changePaymentMethodValue={changePaymentMethodValue}
                        changePaymentMethodTransactionIdValue={changePaymentMethodTransactionIdValue}
                        payment={getPayment()}
                        removePaymentMethod={removePaymentMethod}
                    />
                </div>
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
                            text={ lang["missing"][language] }
                            value={ getPayment().remainingAmount }
                        />         
                    )
                }
                { 
                    hasChanges && (
                        <Typography 
                            classes={{ root: "text-yellow-600 text-md md:text-xl", value: "font-semibold ml-3" }}
                            text={ lang["changes"][language] }
                            value={ getPayment().changes }
                        />         
                    )
                }
            </div>
        </div>
    )
}

export default PaymentContainer