import * as React from "react"

import { SaleDebtInfoType } from "@/types/sale"
import { TableHeadersType } from "@/components/table/types"

import { AppContext } from "@/context/AppContext"
import { LoginContext } from "@/context/LoginContext"
import { SalesContext } from "@/app/stores/[storeId]/sales/context"
import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext";

import SaleDetails from "@/components/dialog/sale-details";
import Table from "@/components/shared/table";

const TableContainer = () => {
    const { fetchDataRef } = React.useContext(AppContext);
    const { credentials } = React.useContext(LoginContext);
    const { unpaidSales } = React.useContext(SalesContext);
    const { setDialog } = React.useContext(StaticTabsContext);

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

    const fetchUnpaidSales = unpaidSales?.data?.fetchData;

    const rowClickHandler = React.useCallback(
        (unpaidSale: SaleDebtInfoType) => () => {
            fetchDataRef.current = fetchUnpaidSales;

            setDialog(
                {
                    header: {
                        title: "Unpaid sale details"
                    },
                    body: (
                        <SaleDetails 
                            initial={{ ...unpaidSale, id: unpaidSale.id }}
                            url={`/api/stores/${credentials?.user?.stores[0]?.storeId}/sales/debts`}
                        />
                    )
                }
            )
        },  
        [ credentials, fetchDataRef, fetchUnpaidSales, setDialog ]
    )

    const list = unpaidSales?.data?.data ?? []

    return (
        <Table 
            data={list}
            headers={headers}
            onClickRow={rowClickHandler}
        />
    )
}

export default TableContainer