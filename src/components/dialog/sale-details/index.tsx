import * as React from "react";
import classNames from "classnames";

import styles from "./styles.module.css"

import { SaleInfoType } from "@/types/sale";

import { AppContext } from "@/context/AppContext";
import { SaleDetailsContext, SaleDetailsContextProvider } from "./context";

import Alert from "@/components/alert"
import Button from "@/components/shared/button";
import PaymentMethodsPanel from "./components/payment-methods";
import ProductsPanel from "./components/products";
import Tab from "./components/tab-button";

import useFetch from "@/hooks/useFetch";

enum TABS {
    PRODUCTS = "products",
    PAYMENT_METHODS = "payment-methods",
    OTHERS = "others"
}

type ProviderPropsType = {
    initial: SaleInfoType;
    url: string;

}

const successAlertData = {
    description: "Sale was successfully update",
    severity: "success",
    title: "Success"
}

const SelectedSaleContaienr = () => {
    const { fetchDataRef } = React.useContext(AppContext)
    const { isModified, toString, url } = React.useContext(SaleDetailsContext)

    const [ tab, setTab ] = React.useState(TABS.PRODUCTS);
    const alertData = React.useRef(successAlertData);

    const onCloseFuncRef = React.useRef<() => void>(null);
    const onOpenFuncRef = React.useRef<() => void>(null);

    const { loading, fetchData } = useFetch({
        autoFetch: false,
        url
    })

    const tabsList = React.useRef([
        { id: TABS.PRODUCTS, label: "Products" },
        { id: TABS.PAYMENT_METHODS, label: "Payment Methods" },
        { id: TABS.OTHERS, label: "Others" }
    ])

    const productsPanel = React.useMemo(() => <ProductsPanel />, []);
    const paymentMethodsPanel = React.useMemo(() => <PaymentMethodsPanel />, [])

    const tabClickHandler = React.useCallback((tabId: TABS) => () => setTab(tabId), []);

    const alertMemo = React.useMemo(() => (
        <Alert 
            { ...alertData.current }
            className={`mx-4 my-4 ${loading ? "" : ""}`}
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
            async onSuccess() {
                alertData.current = successAlertData;

                await fetchDataRef.current?.({});
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
                                [TABS.PAYMENT_METHODS]: paymentMethodsPanel,
                                [TABS.PRODUCTS]: productsPanel
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

const Provider = (props: ProviderPropsType) => (
    <SaleDetailsContextProvider { ...props }>
        <SelectedSaleContaienr />
    </SaleDetailsContextProvider>
)

export default Provider;