import * as React from "react"

import { SaleDebtInfoType } from "@/types/sale"
import { TableHeadersType } from "@/components/table/types"

import { SalesContext } from "@/app/stores/[storeId]/sales/context"

import Table from "@/components/shared/table"

const TableContainer = () => {
    const { unpaidSales } = React.useContext(SalesContext)

    const headers = React.useRef<TableHeadersType[]>(
        [
            {
                label: "Name",
                getComponent({ item }) {
                    const debt = item as SaleDebtInfoType
                    
                    const fullName = `${debt.customer.firstName} ${debt.customer.lastName}`

                    return <span>{ fullName }</span>
                },
                key: {
                    value: "firstName"
                }
            },
            {
                label: "created at",
                key: {
                    value: "createdAt"
                }
            },
            {
                label: "created by",
                getComponent({ item }) {
                    const debt = item as SaleDebtInfoType

                    const fullName = `${debt.user.firstName} ${debt.user.lastName}`

                    return <span>{ fullName }</span>
                },
                key: {
                    value: "createdBy"
                }
            },
            {
                label: "Total",
                key: {
                    value: "total"
                }
            },
            {
                label: "Total received amount",
                key: {
                    value: "totalReceived"
                }
            },
            {
                label: "Remaining amount",
                key: {
                    value: "remainingAmount"
                }
            },
        ]
    )

    const list = unpaidSales?.data?.data ?? []

    return (
        <Table 
            data={list}
            headers={headers}
        />
    )
}

export default TableContainer