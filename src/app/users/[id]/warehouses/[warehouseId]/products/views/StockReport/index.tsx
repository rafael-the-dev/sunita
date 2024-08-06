import * as React from "react"

import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext";
import { StockContextProvider } from "@/context/StockContext";
import { ProductsPageContext } from "../../context"

import useSearchParams from "@/hooks/useSearchParams"

import Button from "@/components/shared/button"
import StockForm from "../../components/add-stock"
import Table from "./components/Table"

enum DIALOG_TYPES {
    STOCK_FORM = "stock-form"
}

const StockReport = () => {
    const { setDialog } = React.useContext(StaticTabsContext);
    const { stockReports } = React.useContext(ProductsPageContext)

    const { data, loading, fetchData } = stockReports

    const searchParams = useSearchParams()

    const openDialogHandler = React.useCallback(
        (id: DIALOG_TYPES) => () => {
            searchParams.setSearchParam("dialog", id)
        }, 
        [ searchParams ]
    )

    const openStockFormDialog = React.useCallback(
        () => {
            setDialog({
                header: {
                    title: "Add stock"
                },
                body: (
                    <StockContextProvider >
                        <StockForm />
                    </StockContextProvider>
                )
            })
        }, 
        [ setDialog ]
    )

    const dialogQueryString = searchParams.get("dialog", "")

    React.useEffect(
        () => {
            if(dialogQueryString === DIALOG_TYPES.STOCK_FORM) openStockFormDialog();
        }, 
        [ dialogQueryString, openStockFormDialog ]
    )

    React.useEffect(
        () => {
            const controller = new AbortController();

            if(!data) {
               fetchData({ signal: controller.signal });
            }

            return () => controller.abort();
        },
        [ data, fetchData ]
    )


    return (
        <div className="flex flex-col h-full items-stretch justify-between">
            <div>
                <Table />
            </div>
            <div className="flex flex-col items-stretch mt-8 sm:flex-row sm:justify-end">
                <Button
                    className="py-2"
                    onClick={openDialogHandler(DIALOG_TYPES.STOCK_FORM)}>
                    Add stock
                </Button>
            </div>
        </div>
    )
}

export default StockReport