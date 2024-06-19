import * as React from "react";
import classNames from "classnames";

import styles from "./styles.module.css"

import { AnalyticsContext } from "@/context/AnalyticsContext"
import { LoginContext } from "@/context/LoginContext"
import { SaleDetailsContext } from "@/context/SaleDetailsContext";

import Alert from "@/components/alert"
import Button from "@/components/shared/button";
import PaymentMethodsPanel from "./components/payment-methods";
import ProductsPanel from "./components/products";
import Tab from "./components/tab-button";

import useFetch from "@/hooks/useFetch";

const successAlertData = {
    description: "Sale was successfully update",
    severity: "success",
    title: "Success"
}

const SelectedSaleContaienr = () => {
    const { getSaleDetails, isModified, refreshData, toString } = React.useContext(SaleDetailsContext)
    const { credentials } = React.useContext(LoginContext);

    const [ tab, setTab ] = React.useState("PRODUCTS");
    const alertData = React.useRef(successAlertData);

    const onCloseFuncRef = React.useRef<() => void>(null);
    const onOpenFuncRef = React.useRef<() => void>(null);

    const { loading, fetchData } = useFetch({
        autoFetch: false,
        url: `/api/stores/12345/sales/${getSaleDetails().id}`
    })

    const tabsList = React.useRef([
        { id: "PRODUCTS", label: "Products" },
        { id: "PAYMENT_METHODS", label: "Payment Methods" },
        { id: "OTHERS", label: "Others" }
    ])

    const productsPanel = React.useMemo(() => <ProductsPanel />, []);
    const paymentMethodsPanel = React.useMemo(() => <PaymentMethodsPanel />, [])

    const tabClickHandler = React.useCallback((tabId: string) => () => setTab(tabId), []);

    const alertMemo = React.useMemo(() => (
        <Alert 
            { ...alertData.current }
            className={`mx-4 mt-4 ${loading ? "" : ""}`}
            onClose={onCloseFuncRef}
            onOpen={onOpenFuncRef}
        />
    ), [ loading ]);

    const submitHandler = async () => {
        if(loading) return;

        onCloseFuncRef.current?.();

        await fetchData({
            options: {
                body: toString(),
                method: "PUT"
            },
            onError(error) {
                alertData.current = {
                    description: error.message,
                    severity: "error",
                    title: "Error"
                }
            },
            async onSuccess(res, data) {
                await refreshData({});
                alertData.current = successAlertData;
            },
        });

        onOpenFuncRef.current?.();
    };

    return (
        <>
            <div className={classNames(styles.root, 'flex flex-col items-stretch')}>
                <div className="overflow-x-auto">
                    <ul className="flex w-fit sm:w-full">
                        {
                            tabsList.current.map((item, index) => (
                                <Tab 
                                    id={item.id}
                                    key={index} 
                                    onClick={tabClickHandler}
                                    selectedTab={tab}
                                >
                                    { item.label }
                                </Tab>
                            ))
                        }
                    </ul>
                </div>
                { alertMemo }
                <div className={classNames("flex flex-col grow items-stretch justify-between py-6",
                    styles.content)}>
                    <div className={classNames(styles.itemsContainer, "px-2 md:px-4")}>
                        {
                            {
                                "PAYMENT_METHODS": paymentMethodsPanel,
                                "PRODUCTS": productsPanel
                            }[tab]
                        }
                    </div>
                    { isModified && (
                        <div className="flex justify-end px-5 md:px-2">
                            <Button
                                onClick={submitHandler}>
                                { loading ? "Loading..." : "Update" }
                            </Button>
                        </div> 
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default SelectedSaleContaienr;