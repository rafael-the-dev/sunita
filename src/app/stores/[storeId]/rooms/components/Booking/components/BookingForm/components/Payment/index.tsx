import { useContext } from "react"

import { BookingContext } from "@/context/BookingContext"

import Button from "@/components/shared/button"
import PaymentMethod from "@/components/shared/payment-method"
import Typography from "./components/Typography"

const PaymentContainer = () => {
    const {
        booking,

        addPaymentMethod,
        changePaymentMethodId, changePaymentMethodValue,
        getPayment,
        removePaymentMethod
    } = useContext(BookingContext)

    const hasChanges = getPayment().changes > 0;
    const showRemainingAmount =  getPayment().remainingAmount > 0 &&  getPayment().remainingAmount < booking.totalPrice;

    return (
        <div className="flex flex-col items-stretch justify-between">
            <div>
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