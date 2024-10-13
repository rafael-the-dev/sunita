
import { PaymentType } from "@/types/payment-method"

import lang from "@/lang/payment.json"

import useLanguage from "@/hooks/useLanguage"

import Button from "@/components/shared/button"
import PaymentMethod from "@/components/shared/payment-method"
import { PaymentFunctionsType } from "@/hooks/usePayment/types"

type PropsType = PaymentFunctionsType & {
    payment: PaymentType
}

const PaymentContainer = (props: PropsType) => {

    const { language } = useLanguage()

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
                { lang["buttons"]["addPM"][language] }
            </Button>
        </>
    )
}

export default PaymentContainer