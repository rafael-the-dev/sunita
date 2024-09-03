import * as React from "react";
import classNames from "classnames";
import currency from "currency.js";
import { v4 as uuidV4 } from "uuid";
import moment from "moment"

import SaveIcon from '@mui/icons-material/Save';

import styles from "./styles.module.css"

import { SaleContext } from "@/context/SalesContext/context/SaleContext";

import Button from "@/components/shared/button"
import ProductsPanel from "./components/products";
import Tab from "./components/tab-button"

const SelectedSaleContaienr = () => {
    const { 
        getCart
    } = React.useContext(SaleContext);

    const [ loading, setLoading ] = React.useState(false);
    const [ tab, setTab ] = React.useState("PRODUCTS");

    const hasResponseError = React.useRef(null);
    const onOpen = React.useRef(null);
    const setDialogMessage = React.useRef(null);

    const tabsList = React.useRef([
        { id: "PRODUCTS", label: "Products" },
        { id: "PAYMENT_METHODS", label: "Payment Methods" },
        { id: "OTHERS", label: "Others" }
    ])

    const paymentMethodsHeaders = React.useRef([
        { label: "Payment Method", value: "description" },
        { label: "Amount", value: "amount" },
        { label: "Received", value: "received" },
        { label: "Changes", value: "changes" },
    ]);

    const productsPanel = React.useMemo(() => <ProductsPanel />, []);


    /*const paymentMethodsTableMemo = React.useMemo(() => (
        <div className="">
            <Table 
                classes={{ tableFooter: "hidden", tableHeaderRow: "bg-stone-300", tableHeadCell: "text-white", root: "h-full", table: "h-full" }}
                data={paymentMehtodsList}
                headers={paymentMethodsHeaders}
            />
        </div>
    ), [ paymentMehtodsList ]);*/
    const tabClickHandler = React.useCallback((tabId: string) => () => setTab(tabId), []);

    /*const refreshSale = async () => {
        const options = getAuthorizationHeader();

        const response = await fetchHelper({ options, url: `/api/sales?${queryStringParamsRef.current}` });
        getSales().update(response.data)
    };*/

    /*const submitHandler = async () => {
        if(loading) return;

        setLoading(true);
        hasResponseError.current = true;
        
        const options = {
            // ...getAuthorizationHeader(),
            body: JSON.stringify({ products: salesChanges.products }),
            method: "PUT"
        }

        try {
            const { status } = await fetch(`/api/sales/${sale.id}`, options);

            if(status >= 300 || status < 200) throw new Error();

            hasResponseError.current = false;
            hasSaleChangedRef.current = true;

            await fetchGlobalSales();

            setSale(null);

            setDialogMessage.current?.(
                {
                    description: "Sale was successfully updated.",
                    type: "success",
                    title: "Success"
                }
            );

            if(queryStringParamsRef.current) {
                // refreshSale();
            }
        }
        catch(e) {
            console.error(e)
            setDialogMessage.current?.(
                {
                    description: e.message,
                    type: "error",
                    title: "Error"
                }
            );
        }
        finally {
            setLoading(false)
        }
    };*/

    return (
        <>
            <div className={classNames(styles.root, 'flex flex-col items-stretch')}>
                <ul className="flex w-full">
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
                <div className={classNames("flex flex-col grow items-stretch justify-between py-6",
                    styles.itemsWrapper)}>
                    <div className={classNames(styles.itemsContainer, "px-5 md:px-4")}>
                        {
                            {
                                // "PAYMENT_METHODS": paymentMethodsTableMemo,
                                "PRODUCTS": productsPanel
                            }[tab]
                        }
                    </div>
                    { /*hasChanges && <div className="flex justify-end px-5 md:px-4">
                        <Button
                            endIcon={<SaveIcon />}
                            onClick={submitHandler}>
                            { loading ? "Loading..." : "Update" }
                        </Button>
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default SelectedSaleContaienr;