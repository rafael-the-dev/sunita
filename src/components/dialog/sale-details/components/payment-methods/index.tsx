import * as React from "react";

import { SaleDetailsContext } from "../../context";

import PaymentList from "@/components/Container/Payment"

const PaymentMethods = () => {
    const { payment, paymentHandlers } = React.useContext(SaleDetailsContext);

    return (
        <div>
            <div className="flex flex-col gap-y-6 items-stretch">
                <div className="flex flex-col items-stretch">
                    <PaymentList 
                        { ...paymentHandlers }
                        payment={payment}
                    />
                </div>
            </div>
        </div>
    )
};

export default PaymentMethods;