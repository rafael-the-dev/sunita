import { useContext, useRef } from "react";

import Table from "@/components/shared/table"
import { AnalyticsContext } from "@/context/AnalyticsContext";
import { TableHeadersType } from "@/components/table/types";

const TableContainer = () => {
    const { getAnalytics } = useContext(AnalyticsContext);

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
    ])

    return (
        <Table 
            data={getAnalytics()?.sales?.list}
            headers={headers}
        />
    )
};

export default TableContainer;