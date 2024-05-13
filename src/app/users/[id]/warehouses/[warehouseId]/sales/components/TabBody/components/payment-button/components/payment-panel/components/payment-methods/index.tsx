import * as React from "react"
import classNames from "classnames"

import styles from "./styles.module.css"
import { SaleContext } from "@/context/SalesContext/context/SaleContext"

import Button from "@/components/shared/button"
import PaymentMethod from "./components/payment-method"
import Typography from "./components/Typography"
import { AppContext } from "@/context/AppContext"
import { CartResquestType } from "@/types/cart"
import { SalesContext } from "@/context/SalesContext"
import useFetch from "@/hooks/useFetch"

type ProsType = {
    setSuccefulPayment: () => void;
}

const PaymentMethodsPanel = ({ setSuccefulPayment }: ProsType) => {
    const { isLoading } = React.useContext(AppContext)
    const { addPaymentMethod, getCart, getPaymentMethods, resetCart } = React.useContext(SaleContext)
    const { fetchProducts } = React.useContext(SalesContext);

    const { fetchData, loading } = useFetch({
        autoFetch: false,
        url: `/api/users/rafaeltivane/warehouses/12345/sales`
    });

    const hasChanges = getPaymentMethods().changes > 0;
    const showRemainingAmount =  getPaymentMethods().remainingAmount > 0 &&  getPaymentMethods().remainingAmount < getCart().total;
    const disableButton = showRemainingAmount || getPaymentMethods().totalReceived <= 0;

    const submitHandler = async () => {
        isLoading.current = true;
        
        const cart = getCart();
        const paymentMethods = getPaymentMethods();

        const body: CartResquestType = {
            changes: paymentMethods.changes,
            items: cart.items.map(item => ({ ...item, product: { id: item.product.id } })),
            paymentMethods: {
                changes: paymentMethods.changes,
                list: paymentMethods.paymentMethods,
                totalReceived: paymentMethods.totalReceived,
            },
            total: cart.total,
            totalReceived: paymentMethods.totalReceived
        };

        const options = {
            body: JSON.stringify(body),
            method: "POST"
        }

        await fetchData({
            options,
            onError() {

            },
            async onSuccess() {
                setSuccefulPayment()
                resetCart();
                await fetchProducts({})
            }
        });

        isLoading.current = false;
    };

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
                    { hasChanges && (
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
                    disabled={disableButton}
                    onClick={submitHandler}>
                    { loading ? "Loading..." : "Pay" }
                </Button>
            </div>
        </form>
    )
}

export default PaymentMethodsPanel