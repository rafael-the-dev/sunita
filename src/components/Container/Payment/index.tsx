
import { PaymentType } from "@/types/payment-method"

import Button from "@/components/shared/button"
import PaymentMethod from "@/components/shared/payment-method"
import { PaymentFunctionsType } from "@/hooks/usePayment/types"

type PropsType = PaymentFunctionsType & {
    payment: PaymentType
}

const PaymentContainer = (props: PropsType) => {

    return (
        <>
            <div className="flex flex-col items-stretch">
                {
                    props
                        .payment
                        .paymentMethods
                        .map(paymentMethod => (
                            <PaymentMethod
                                { ...paymentMethod } 
                                {...props }
                                getPayment={() => props.payment}
                                key={paymentMethod.id}
                            />
                        ))
                }
            </div>
            <Button
                className="block mt-4 mx-auto py-2"
                onClick={props.addPaymentMethod}>
                Add payment method
            </Button>
        </>
    )
}

export default PaymentContainer