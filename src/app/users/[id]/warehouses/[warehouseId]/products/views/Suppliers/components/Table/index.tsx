import { useContext, useRef } from "react"

import { SupplierType } from "@/types/Supplier"
import { TableHeadersType } from "@/components/table/types"

import { ProductsPageContext } from "@/app/users/[id]/warehouses/[warehouseId]/products/context"

import Status from "@/components/shared/Status"
import Table from "@/components/shared/table"

const TableContainer = () => {
    const { suppliers } = useContext(ProductsPageContext);

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
                label: "Contact",
                getComponent({ item, key }) {
                    const supplier = item as SupplierType

                    return supplier
                        .contact
                        .phone
                        .map(item => item.number)
                        .join(", ")
                },
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

    const suppliersList = suppliers?.data?.list ?? [];

    return (
        <Table 
            classes={{ root: "mt-6 table-body" }}
            data={suppliersList}
            headers={headers}
        />
    )
}

export default TableContainer