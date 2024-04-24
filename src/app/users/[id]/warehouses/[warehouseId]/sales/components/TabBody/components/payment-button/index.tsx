import * as React from "react"
import classNames from "classnames"

import { SaleContext } from "@/context/SalesContext/context/SaleContext"

import Button from "@/components/shared/button"
import { Console } from "console"

const PaymentButton = () => {
    const { getCart, isEmpty } = React.useContext(SaleContext)
    
    return (
        <>
            <Button
                className={classNames("border-0 opacity-90 py-4 px-6 rounded-none md:py-6 md:px-16 md:text-xl", { "opacity-60": isEmpty })}
                disabled={isEmpty}>
                Pay { getCart().total } MT
            </Button>
        </>
    )
}

export default PaymentButton