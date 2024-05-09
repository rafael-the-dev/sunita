import { ChangeEvent, useCallback, useContext, useEffect, useRef } from "react";
import classNames from "classnames";
import Typography from "@mui/material/Typography"

import styles from "./styles.module.css";

import { CartItem } from "@/types/cart";
import { ProductInfoType } from "@/types/product";
import { AppContext } from "@/context/AppContext";
import { StockContext } from "@/context/StockContext";
import { TableHeadersType } from "@/components/table/types";
import { SetterFuncType } from "@/context/StockContext/types";

import Alert from "@/components/alert";
import Button from "@/components/shared/button";
import Collapse from "@/components/collapse";
import DateTimeInput from "@/components/date"
import QuantityInput from "@/components/shared/quantity-input"
import SearchProduct from "./components/search-product";
import Table from "@/components/shared/table";
import Textfield from "@/components/Textfield"
import useFech from "@/hooks/useFetch";
import moment from "moment";
import { isLessOrEqualToZero } from "@/helpers/stock-report";

const alertSuccessProps = {
    description: "Stock was successfully sent",
    severity: "success",
    title: "Success"
};

const AddStock = ({ refreshProducts }: { refreshProducts: ({ signal }: { signal: AbortSignal }) => Promise<void> }) => {
    const { dialog, setDialog } = useContext(AppContext)

    const changeHandler = useCallback((product: ProductInfoType, func: SetterFuncType) => (e: ChangeEvent<HTMLInputElement>) => {
        func(product, e.target.value, "CHANGE");
    }, [])

    const { 
        getCart, getStockReport,
        hasErrors,
        removeItem, reset,
        setDate, setQuantity, setReference, setSellPrice, setTotal,
        toString 
    } = useContext(StockContext)

    const headers = useRef<TableHeadersType[]>([
        {
            label: "Name",
            key: {
                value: "product",
                subKey: {
                    value: "name"
                }
            }
        },
        {
            label: "Quantity",
            getComponent: ({ item }) => {
                const cartItem = item as CartItem<ProductInfoType>;
                return (
                    <QuantityInput 
                        hasError={isLessOrEqualToZero(cartItem.quantity)}
                        onChange={changeHandler(cartItem.product, setQuantity)}
                        onDecrement={() => setQuantity(cartItem.product, -1)}
                        onIncrement={() => setQuantity(cartItem.product, 1)}
                        value={cartItem.quantity}
                    />
                )
            },
            key: {
                value: "quantity"
            }
        },
        {
            label: "Total",
            getComponent: ({ item }) => {
                const cartItem = item as CartItem<ProductInfoType>;
                return (
                    <QuantityInput 
                        hasError={isLessOrEqualToZero(cartItem.total)}
                        onChange={changeHandler(cartItem.product, setTotal)}
                        onDecrement={() => setTotal(cartItem.product, -1)}
                        onIncrement={() => setTotal(cartItem.product, 1)}
                        value={cartItem.total}
                    />
                )
            },
            key: {
                value: "total"
            }
        },
        {
            label: "Purchase price",
            key: {
                value: "product",
                subKey: {
                    value: "purchasePrice"
                }
            }
        },
        {
            label: "Sell price",
            getComponent: ({ item }) => {
                const cartItem = item as CartItem<ProductInfoType>;
                return (
                    <QuantityInput 
                        hasError={isLessOrEqualToZero(cartItem.product.sellPrice) || cartItem.product.purchasePrice >= cartItem.product.sellPrice}
                        onChange={changeHandler(cartItem.product, setSellPrice)}
                        onDecrement={() => setSellPrice(cartItem.product, -1)}
                        onIncrement={() => setSellPrice(cartItem.product, 1)}
                        value={cartItem.product.sellPrice}
                    />
                )
            },
            key: {
                value: "product",
                subKey: {
                    value: "sellPrice"
                }
            }
        },
        {
            label: "Profit",
            key: {
                value: "product",
                subKey: {
                    value: "profit"
                }
            }
        },
        {
            label: "Remove",
            key: {
                value: "delete"
            }
        }
    ]);

    const cancelHandler = useCallback(() => setDialog(null), [ setDialog ]);
    const removeHandler = useCallback((row: CartItem<ProductInfoType>) => () => removeItem(row.product.id), [ removeItem ]);

    const referenceChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setReference(e.target.value), [ setReference ])

    // const dateChangeHandler = useCallback((value: string) => setDate(), [])

    const alertProps = useRef(alertSuccessProps)

    const onCloseAlertRef = useRef<() => void>(null);
    const onOpenAlertRef = useRef<() => void>(null);

    const { fetchData, loading } = useFech({
        autoFetch: false,
        url: `/api/users/rafaeltivane/warehouses/12345/products/stock-reports`
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
                await refreshProducts({ signal: null });
                alertProps.current = alertSuccessProps;
            },
        })

        onOpenAlertRef.current?.();
        reset();
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
                        <Table 
                            data={getCart().items}
                            headers={headers}
                            onRemoveRow={removeHandler}
                        />
                        <div className="flex justify-end mt-16">
                            <div className={classNames(styles.formTotal, `bg-primary-700 mb-4 text-white px-3 py-4 md:flex flex-col
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