import * as React from "react"

import { ContactType } from "@/types/contact"
import { Store } from "@/types/warehouse"
import { STATUS } from "@/types"
import { TableHeadersType } from "@/components/table/types"
import { FeeDetailsType } from "@/types/fees"

import {StoresContext} from "@/app/system/stores/context"

import Status from "@/components/shared/Status"
import Table from "@/components/shared/table"
import { PAYMENT_STATUS } from "@/types/payment-method"

const TableView = () => {
    const { fees } = React.useContext(StoresContext)

    const headers = React.useRef<TableHeadersType[]>(
        [
            {
                label: "ID",
                key: {
                    value: "id"
                }
            },
            {
                label: "Type",
                key: {
                    value: "type"
                }
            },
            {
                label: "Late payment fine",
                getComponent({ item }) {
                    const fee = item as FeeDetailsType

                    return (
                        <span> 
                            { fee.latePaymentFine ? "Yes" : "No" }
                        </span>
                    )
                },
                key: {
                    value: "latePaymentFine"
                }
            },
            {
                label: "Price",
                key: {
                    value: "price"
                }
            },
            {
                label: "Total",
                key: {
                    value: "total"
                }
            },
            {
                label: "Status",
                getComponent({ item }) {
                    const fee = item as FeeDetailsType;

                    const status = {
                        [PAYMENT_STATUS.PAID]: STATUS.ACTIVE,
                        [PAYMENT_STATUS.PENDING]: STATUS.INACTIVE
                    }[fee.status]

                    return <Status status={status} />
                },
                key: {
                    value: "status"
                }
            }
        ]
    )

    const feesList = fees?.data?.data?.list ?? []

    return (
        <Table 
            data={feesList}
            headers={headers}
        />
    )
}

export default TableView