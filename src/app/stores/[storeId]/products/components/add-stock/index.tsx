import { useCallback, useContext, useRef } from "react";
import classNames from "classnames";
import moment from "moment";

import Typography from "@mui/material/Typography"

import styles from "./styles.module.css";

import { LoginContext } from "@/context/LoginContext";

import { AppContext } from "@/context/AppContext";
import { CartItem } from "@/types/cart";
import { ProductsPageContext } from "../../context";
import { ProductInfoType } from "@/types/product";
import { StockContext } from "@/context/StockContext";

import useFetch from "@/hooks/useFetch";

import Alert from "@/components/alert";
import Button from "@/components/shared/button";
import DateTimeInput from "@/components/date"
import SearchProduct from "./components/search-product";
import Table from "./components/Table";
import Textfield from "@/components/Textfield"

const alertSuccessProps = {
    description: "Stock was successfully sent",
    severity: "success",
    title: "Success"
};

const AddStock = () => {
    const { dialog, setDialog } = useContext(AppContext)
    const { credentials } = useContext(LoginContext)

    const { products, stockReports } = useContext(ProductsPageContext)
  
    const { 
        getCart, getStockReport,
        hasErrors,
        removeItem, reset,
        setDate, setReference,
        toString 
    } = useContext(StockContext)

    const cancelHandler = useCallback(() => setDialog(null), [ setDialog ]);

    const referenceChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setReference(e.target.value), [ setReference ])

    const alertProps = useRef(alertSuccessProps)

    const onCloseAlertRef = useRef<() => void>(null);
    const onOpenAlertRef = useRef<() => void>(null);

    const { fetchData, loading } = useFetch({
        autoFetch: false,
        url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/products/stock-reports`
    });

    const keyPressHandler = useCallback((e: React.KeyboardEvent<HTMLFormElement>) => {
        if(e.key === "Enter") return;
    }, []);

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        onCloseAlertRef.current?.();

        await fetchData({
            options: {
                body: toString(),
                method: "POST"
            },
            onError(error){
                alertProps.current = {
                    description: error.message,
                    severity: "error",
                    title: "Error"
                };
            },
            async onSuccess(res, data) {
                await Promise.all(
                    [
                        products.fetchData({}),
                        stockReports.fetchData({})
                    ]
                );

                alertProps.current = alertSuccessProps;

                reset();
            },
        })

        onOpenAlertRef.current?.();
    };

    return (
        <form 
            className={classNames(styles.form, `pt-4 pb-12 relative`)} 
            onSubmit={submitHandler}
            onKeyDown={keyPressHandler}>
            <Alert 
                { ...alertProps.current }
                className="mx-3 mb-6"
                onClose={onCloseAlertRef}
                onOpen={onOpenAlertRef}
            />
            <div className="sm:flex justify-between px-3 pb-1">
                <Textfield 
                    { ...getStockReport().reference }
                    className={classNames(styles.formInput, ``)}
                    label="Reference"
                    onChange={referenceChangeHandler}
                    required
                />
                <DateTimeInput 
                    { ...getStockReport().date }
                    className={classNames(styles.formInput, ``)}
                    maxDateTime={moment(Date.now()).toISOString()}
                    onChange={setDate}
                    label="Date"
                />
            </div>
            <SearchProduct />
            {
                getCart().items.length > 0 && (
                    <div className="px-3 pb-6">
                        <Table />
                        <div className="flex justify-end mt-16">
                            <div className={classNames(styles.formTotal, `bg-primary-700 mb-4 text-white px-6 py-4 md:flex flex-col
                                justify-around md:mb-0 md:pl-8`)}>
                                <Typography
                                    component="h2"
                                    className="text-lg">
                                    Total<br/>
                                    <span
                                        className="font-semibold mt-3 text-2xl">
                                        { getCart().total } MT
                                    </span>
                                </Typography>
                            </div>
                        </div>
                        <div className="flex flex-col mt-8 sm:flex-row sm:justify-end">
                           {
                                !dialog?.payload && (
                                    <>
                                         <Button 
                                            className="mb-3 sm:mb-0 sm:mr-3" 
                                            onClick={cancelHandler}
                                            variant="outlined">
                                            Cancel
                                        </Button>
                                        <Button 
                                            className=""
                                            disabled={hasErrors()}
                                            type="submit">
                                            { loading ? "Loading..." : "Submit" }
                                        </Button>
                                    </>
                                )
                           }
                        </div>
                    </div>
                )
            }
        </form>
    );
};

export default AddStock;