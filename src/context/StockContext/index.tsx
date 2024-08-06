import * as React from "react";
import moment from "moment";

import { ProductsPageContext } from "@/app/users/[id]/warehouses/[warehouseId]/products/context"
import { StockContextProviderPropsType, StockContextType, StockReportInputProps } from "./types";
import { StockClientRequestBodyType, StockReportInfoType } from "@/types/stock";
import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext";

import useCart from "./hooks/useCart";
import { isValidPrice } from "./ts/validation";
import { AppContext } from "../AppContext";

export const StockContext = React.createContext<StockContextType | null>(null);
StockContext.displayName = "StockContext";

const inputProps: StockReportInputProps = {
    error: false,
    helperText: "",
    value: ""
};

export const StockContextProvider = ({ children }: StockContextProviderPropsType) => {
    const { dialog } = React.useContext(AppContext);
    const { setDialog } = React.useContext(StaticTabsContext);

    const { getCart, ...cartRest } = useCart();

    const [ stockReport, setStockReport ] = React.useState(() => {
        const initial = {
            date: structuredClone({ ...inputProps, value: moment(Date.now()).toISOString() }),
            reference: structuredClone(inputProps)
        }

        if(dialog?.payload) {
            const stockReport = dialog.payload as StockReportInfoType;
            //@ts-ignore
            initial.date.value = stockReport.createdAt;
            initial.reference.value = stockReport.reference
        }

        return initial;
    })

    const getStockReport = React.useCallback(() => structuredClone(stockReport), [ stockReport ]);


    const hasErrors = React.useCallback(() => {
        const stockReport = getStockReport();
        return Boolean([ !isValidPrice(getCart()), stockReport.date.error, stockReport.reference.error ].find(item => item));
    }, [ getCart, getStockReport ])

    const setDate = React.useCallback((value: string) => {
        const date = moment(value)
        const isInvalid = !date.isValid();
        
        setStockReport(stockReport => ({
            ...stockReport,
            date: {
                error: isInvalid,
                helperText: isInvalid ? "Date is invalid" : "",
                value: date.toISOString()
            }
        }));
    }, [])

    const setReference = React.useCallback((value: string) => {
        const isEmpty = !Boolean(value.trim());

        setStockReport(stockReport => ({
            ...stockReport,
            reference: {
                error: isEmpty,
                helperText: isEmpty ? "Reference must not be empty" : "",
                value
            }
        }));
    }, [])

    const resetCart = cartRest.reset

    const reset = React.useCallback(() => {
        resetCart()
        setStockReport({
            date: structuredClone({ ...inputProps, value: moment(Date.now()).toISOString() }),
            reference: structuredClone(inputProps)
        })
    }, [ resetCart ])

    const toString = React.useCallback(() => {
        const cart = getCart();

        const requestBody: StockClientRequestBodyType = {
            createdAt: getStockReport().date.value,
            items: cart.items.map(item => ({
                product: {
                    id: item.product.id,
                    purchasePrice: item.product.purchasePrice,
                    sellPrice: item.product.sellPrice
                },
                quantity: item.quantity,
                total: item.total
            })),
            reference: getStockReport().reference.value,
            total: cart.total
        };

        return JSON.stringify(requestBody);
    }, [ getCart, getStockReport ])

    return (
        <StockContext.Provider
            value={{
                ...cartRest,
                getCart, getStockReport,
                hasErrors,
                reset,
                setDate, setReference,
                toString
            }}>
            { children }
        </StockContext.Provider>
    )
}