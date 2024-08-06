import { useContext, useCallback, useMemo, useRef } from "react"

import { AnalyticStockReportInfoType, StockReportInfoType } from "@/types/stock";
import { ProductsPageContext } from "@/app/users/[id]/warehouses/[warehouseId]/products/context"

import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext";
import { StockContextProvider } from "@/context/StockContext";
import { TableHeadersType } from "@/components/table/types";

import StockForm from "@/app/users/[id]/warehouses/[warehouseId]/products/components/add-stock"
import Table from "@/components/shared/table";

const StockReportTable = () => {
    const { setDialog } = useContext(StaticTabsContext);

    const { stockReports } = useContext(ProductsPageContext)
    const { data } = stockReports

    const tableHeaders = useRef<TableHeadersType[]>(
        [
            {
                label: "Date",
                key: {
                    value: "createdAt"
                }
            },
            {
                getComponent({ item, key }) {
                    const report  = item as StockReportInfoType
    
                    return (
                        <span>
                            { report.user.firstName } { report.user.lastName }
                        </span>
                    )
                },
                label: "Created by",
                key: {
                    value: "user"
                }
            },
            {
                label: "Reference",
                key: {
                    value: "reference"
                }
            },
            {
                label: "Total",
                key: {
                    value: "total"
                }
            }
        ]
    )

    const rowClickHandler = useCallback((stockReport: StockReportInfoType) => () => {
        try {
            setDialog({
                header: {
                    title: "Stock Report"
                },
                body: (
                    <StockContextProvider>
                        <StockForm />
                    </StockContextProvider>
                ),
                payload: stockReport
            });
        } catch(e) {
            console.error(e)
        }
    }, [ setDialog ])

    return (
        <Table 
            data={data?.list ?? []}
            headers={tableHeaders}
            onClickRow={rowClickHandler}
        />
    )
}

export default StockReportTable