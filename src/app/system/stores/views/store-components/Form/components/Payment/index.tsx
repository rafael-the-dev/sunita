import * as React from "react"

import { FormContext } from "../../context"

import Payment from "@/components/Container/Payment"
import PaymentCheckout from "@/components/Container/Payment/components/PaymentCheckout"

const PaymentContainer = () => {
    const { payment } = React.useContext(FormContext)
    const { changes, remainingAmount, totalReceived } = payment.getPayment()

    return (
        <div className="flex flex-col grow items-stretch justify-between">
            <Payment 
                { ...payment }
                payment={payment.getPayment()}
            />
            <PaymentCheckout 
                changes={changes}
                remainingAmount={remainingAmount}
                totalReceivedAmount={totalReceived}
                total={8500}
            />
        </div>
    )
}

export default PaymentContainer