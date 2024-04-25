import * as React from "react"
import classNames from "classnames"

import styles from "./styles.module.css"
import { SaleContext } from "@/context/SalesContext/context/SaleContext"

import Button from "@/components/shared/button"
import PaymentMethod from "./components/payment-method"
import Typography from "./components/Typography"

const PaymentMethodsPanel = () => {
    const { addPaymentMethod, getCart, getPaymentMethods } = React.useContext(SaleContext)

    const showRemainingAmount =  getPaymentMethods().remainingAmount > 0 &&  getPaymentMethods().remainingAmount < getCart().total

    return (
        <form className="flex flex-col grow justify-between">
            <div className={classNames("overflow-y-auto px-2 pt-6 md:pt-8", styles.paymentMethods)}>
                <div>
                    {
                        getPaymentMethods().paymentMethods.map(paymentMethod => (
                            <PaymentMethod 
                                key={paymentMethod.id}
                                { ...paymentMethod }
                            />
                        ))
                    }
                </div>
                <div className="flex justify-end py-4 md:py-6">
                    <Button onClick={addPaymentMethod}>Add payment method</Button>
                </div>
            </div>
            <div className="flex flex-col items-end px-3 pb-3 text-right">
                <div className="mb-3">
                    <Typography 
                        classes={{ root: "text-2xl md:text-3xl", value: "font-bold ml-3" }}
                        text="Total"
                        value={getCart().total}
                    />
                    { showRemainingAmount && (
                        <Typography 
                            classes={{ root: "text-red-600 text-md md:text-xl", value: "font-semibold ml-3" }}
                            text="Mising"
                            value={getPaymentMethods().remainingAmount}
                        />         
                    )
                    }
                    { getPaymentMethods().changes > 0 && (
                        <Typography 
                            classes={{ root: "text-yellow-600 text-md md:text-xl", value: "font-semibold ml-3" }}
                            text="Changes"
                            value={getPaymentMethods().changes}
                        />         
                    )
                    }
                </div>
                <Button
                    className="py-2 px-4"
                    disabled={showRemainingAmount || getPaymentMethods().totalReceived <= 0}>
                    Pay
                </Button>
            </div>
        </form>
    )
}

export default PaymentMethodsPanel