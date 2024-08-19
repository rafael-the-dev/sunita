import { useRef } from "react";

import { CustomerType } from "@/types/guest";
import { TableHeadersType } from "@/components/table/types";

import Table from "@/components/shared/table";

const TableContainer = () => {
    const headers = useRef<TableHeadersType[]>([
        {
            label: "Name",
            getComponent({ item }) {
                const customer = item as CustomerType;

                return (
                    <span>
                        { customer.firstName } { customer.lastName }
                    </span>
                )
            },
            key: {
                value: "firstName"
            }
        },
        {
            label: "Contact",
            getComponent({ item }) {
                const customer = item as CustomerType

                return (
                    <span className="capitalize">
                        { customer.contact.phone.map(phone => phone.number) }
                    </span>
                )
            },
            key: {
                value: "stores"
            }
        },
        {
            label: "Debts",
            getComponent({ item }) {
                const user = item as CustomerType

                return (
                    <div>
                        { 0 } MT
                    </div>
                )
            },
            key: {
                value: "stores"
            }
        }
    ])

    return (
        <Table 
            classes={{ root: "mt-6" }}
            data={[]} 
            headers={headers}
        />
    )
}

export default TableContainer