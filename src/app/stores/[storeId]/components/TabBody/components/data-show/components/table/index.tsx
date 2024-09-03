import { useCallback, useContext, useRef } from "react";

import { AnalyticsContext } from "@/context/AnalyticsContext";
import { TableHeadersType } from "@/components/table/types";

import { AppContext } from "@/context/AppContext"
import { SaleInfoType } from "@/types/sale";

import SaleDetails from "./components/sale-details"
import Table from "@/components/shared/table";
import { SaleDetailsContextProvider } from "@/context/SaleDetailsContext";

const TableContainer = () => {
    const { fetchData, getAnalytics } = useContext(AnalyticsContext);
    const { setDialog } = useContext(AppContext)

    const headers = useRef<TableHeadersType[]>([
        {
            label: "Date",
            key: {
                value: "createdAt"
            }
        },
        {
            label: "Sold by",
            key: {
                value: "user",
                subKey: {
                    value: "firstName"
                }
            }
        },
        {
            label: "Total",
            key: {
                value: "total"
            }
        },
        {
            label: "Total Received",
            key: {
                value: "totalReceived"
            }
        },
        {
            label: "Changes",
            key: {
                value: "changes"
            }
        },
        {
            label: "Profit",
            key: {
                value: "profit"
            }
        }
    ]);

    const clickHandler = useCallback((row: SaleInfoType) => () => {
        setDialog({
            header: {
                title: "Sale details"
            },
            body: <SaleDetailsContextProvider initial={row} refreshData={fetchData}><SaleDetails /></SaleDetailsContextProvider>
        })
    }, [ fetchData, setDialog ])

    return (
        <Table 
            data={getAnalytics()?.sales?.list}
            headers={headers}
            onClickRow={clickHandler}
        />
    )
};

export default TableContainer;