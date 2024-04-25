import * as React from "react"

import styles from "./styles.module.css"
import { SaleContext } from "@/context/SalesContext/context/SaleContext"

import Button from "@/components/shared/button"
import PaymentMethod from "./components/payment-method"
import classNames from "classnames"

const PaymentMethodsPanel = () => {
    const { addPaymentMethod, getPaymentMethods } = React.useContext(SaleContext)

    return (
        <form className="flex flex-col grow justify-between">
            <div className={classNames("overflow-y-auto px-2 pt-6 md:pt-8", styles.paymentMethods)}>
                <div>
                    {
                        getPaymentMethods().map(paymentMethod => (
                            <PaymentMethod 
                                key={paymentMethod.id}
                                { ...paymentMethod }
                            />
                        ))
                    }
                </div>
                <div className="flex justify-end py-3 md:py-6">
                    <Button onClick={addPaymentMethod}>Add payment method</Button>
                </div>
            </div>
            <div className="flex justify-end px-3 pb-3">
                <Button>Submit</Button>
            </div>
        </form>
    )
}

export default PaymentMethodsPanel