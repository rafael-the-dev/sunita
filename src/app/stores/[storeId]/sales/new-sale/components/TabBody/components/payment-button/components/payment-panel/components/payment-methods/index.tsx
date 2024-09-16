import * as React from "react"
import classNames from "classnames"

import styles from "./styles.module.css"

import { CartResquestType } from "@/types/cart"

import { AppContext } from "@/context/AppContext"
import { LoginContext } from "@/context/LoginContext"
import { SaleContext } from "@/context/SalesContext/context/SaleContext"
import { SalesContext } from "@/context/SalesContext"

import useFetch from "@/hooks/useFetch"

import { isValidPayment } from "@/validation/payment"

import Alert from "@/components/alert"
import Button from "@/components/shared/button"
import PaymentMethodsContainer from "@/components/Container/Payment"
import Typography from "./components/Typography"

type ProsType = {
    setSuccefulPayment: () => void;
}

const PaymentMethodsPanel = ({ setSuccefulPayment }: ProsType) => {
    const { credentials } = React.useContext(LoginContext)
    const { isLoading } = React.useContext(AppContext)
    const { fetchProducts } = React.useContext(SalesContext);

    const { 
        addPaymentMethod,
        changePaymentMethodId, changePaymentMethodValue, changePaymentMethodTransactionIdValue,
        getCart, getPaymentMethods, 
        removePaymentMethod,
        resetCart
    } = React.useContext(SaleContext);

    const { fetchData, loading } = useFetch({
        autoFetch: false,
        url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/sales`
    });

    const hasChanges = getPaymentMethods().changes > 0;
    const showRemainingAmount =  getPaymentMethods().remainingAmount > 0 &&  getPaymentMethods().remainingAmount < getCart().total;
    const disableButton = showRemainingAmount || !isValidPayment(getPaymentMethods(), getCart().total) || loading;

    const errorMessage = React.useRef("");
    const onCloseFuncRef = React.useRef<() => void | null>(null);
    const onOpenFuncRef = React.useRef<() => void | null>(null);

    const alertMemo = React.useMemo(() => (
        <Alert 
            className={`mx-2 mt-4 ${loading && ""}`}
            description={errorMessage.current}
            onClose={onCloseFuncRef}
            onOpen={onOpenFuncRef}
            severity="error"
            title="Error"
        />
    ), [ loading ]);

    const submitHandler = async () => {
        isLoading.current = true;
        onCloseFuncRef.current?.();

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
            onError(error) {
                errorMessage.current = error.message;
                onOpenFuncRef.current?.();
            },
            async onSuccess() {
                setSuccefulPayment();
                resetCart();
                await fetchProducts({})
            }
        });

        isLoading.current = false;
    };

    return (
        <form className="flex flex-col grow justify-between">
            { alertMemo }
            <div className={classNames("overflow-y-auto px-2 pt-6 md:pt-8", styles.paymentMethods)}>
                <PaymentMethodsContainer 
                    addPaymentMethod={addPaymentMethod}
                    changePaymentMethodId={changePaymentMethodId}
                    changePaymentMethodValue={changePaymentMethodValue}
                    changePaymentMethodTransactionIdValue={changePaymentMethodTransactionIdValue}
                    payment={getPaymentMethods()}
                    removePaymentMethod={removePaymentMethod}
                />
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