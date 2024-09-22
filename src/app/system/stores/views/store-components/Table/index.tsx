import * as React from "react"

import { ContactType } from "@/types/contact"
import { Store } from "@/types/warehouse"
import { TableHeadersType } from "@/components/table/types"

import {StoresContext} from "../../../context"

import Status from "@/components/shared/Status"
import Table from "@/components/shared/table"

const TableView = () => {
    const { stores } = React.useContext(StoresContext)

    const headers = React.useRef<TableHeadersType[]>(
        [
            {
                label: "Name",
                key: {
                    value: "name"
                }
            },
            {
                label: "Contact",
                getComponent({ item }) {
                    const store = item as Store;

                    return (
                        <span>
                            {
                                store
                                    .contact
                                    .phone
                                    .map(contact => contact.number)
                                    .join(", ")
                            }
                        </span>
                    )
                },
                key: {
                    value: "name"
                }
            },
            {
                label: "Status",
                getComponent({ item }) {
                    const store = item as Store;

                    return <Status status={store.status} />
                },
                key: {
                    value: "status"
                }
            }
        ]
    )

    const storesList = stores?.data?.data ?? []

    return (
        <Table 
            data={storesList}
            headers={headers}
        />
    )
}

export default TableView