import { useContext, useRef } from "react"

import { SupplierType } from "@/types/Supplier"
import { TableHeadersType } from "@/components/table/types"

import Status from "@/components/shared/Status"
import Table from "@/components/shared/table"

const TableContainer = () => {
    const headers = useRef<TableHeadersType[]>(
        [
            {
                label: "Name",
                key: {
                    value: "name"
                }
            },
            {
                label: "NUIT",
                key: {
                    value: "nuit"
                }
            },
            {
                label: "",
                key: {
                    value: ""
                }
            },
            {
                label: "Status",
                getComponent({ item, key }) {
                    const supplier = item as SupplierType

                    return (
                        <Status 
                            status={supplier.status}
                        />
                    )
                },
                key: {
                    value: ""
                }
            },
        ]
    )

    return (
        <Table 
            classes={{ root: "mt-6" }}
            data={[]}
            headers={headers}
        />
    )
}

export default TableContainer