import * as React from "react"

import { FiltersContextProvider } from "@/context/FiltersContext";
import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext";
import { LoginContext } from "@/context/LoginContext"
import { StockContextProvider } from "@/context/StockContext";
import { ProductsPageContext } from "../../context"

import useSearchParams from "@/hooks/useSearchParams"
import { formatDates } from "@/helpers/date";

import Button from "@/components/shared/button"
import Card from "@/components/shared/report-card"
import Filters from "./components/Filters"
import StockForm from "../../components/add-stock"
import Table from "./components/Table"

enum DIALOG_TYPES {
    STOCK_FORM = "stock-form"
}

const StockReport = () => {
    const { setDialog } = React.useContext(StaticTabsContext);
    const { stockReports } = React.useContext(ProductsPageContext)

    const searchParams = useSearchParams()

    const { data, loading, fetchData } = stockReports
    const stockReportRange = React.useMemo(() => data ? formatDates(data.list) : "", [ data ])

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
            <div className="flex flex-col items-stretch">
                <div className="items-stretch mb-6 md:flex">
                    <Card>
                        <div>
                            <Card.Title>
                                <span className="text-base">Date</span><br/>
                                { stockReportRange  }
                            </Card.Title>
                        </div>
                        <div>
                            <Card.Description>
                                { data?.total } MT
                            </Card.Description>
                        </div>
                    </Card>
                    <Filters />
                </div>
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

const StockReportContextWrapper = () => {
    const { credentials } = React.useContext(LoginContext)
    const { stockReports } = React.useContext(ProductsPageContext)

    return (
        <FiltersContextProvider
            autoFetch={false}
            list={ stockReports.data}
            refetchData={ stockReports.fetchData }
            url={`/api/stores/${credentials?.user?.stores[0]?.storeId}/products/stock-reports`}>
            <StockReport />
        </FiltersContextProvider>
    )
}

export default StockReportContextWrapper