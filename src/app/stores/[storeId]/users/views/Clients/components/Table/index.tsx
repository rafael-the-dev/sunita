import { useContext, useRef } from "react";

import { CustomerType } from "@/types/guest";
import { TableHeadersType } from "@/components/table/types";

import { UsersPageContext } from "../../../../context";

import Table from "@/components/shared/table";

const TableContainer = () => {
    const { customers } = useContext(UsersPageContext)

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
                        { 
                            customer
                                .contact
                                .phone
                                .map(phone => phone.number)
                                .join(", ") 
                        }
                    </span>
                )
            },
            key: {
                value: "stores"
            }
        },
        {
            label: "Doc type",
            key: {
                value: "document",
                subKey: {
                    value: "type"
                }
            }
        },
        {
            label: "Doc number",
            key: {
                value: "document",
                subKey: {
                    value: "number"
                }
            }
        }
    ])

    return (
        <Table 
            classes={{ root: "mt-6" }}
            data={customers.data?.list ?? []} 
            headers={headers}
        />
    )
}

export default TableContainer