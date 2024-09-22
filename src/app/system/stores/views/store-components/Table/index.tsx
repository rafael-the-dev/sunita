import * as React from "react"

import { ContactType } from "@/types/contact"
import { TableHeadersType } from "@/components/table/types"

import Table from "@/components/shared/table"

const TableView = () => {
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
                    const contact = item as ContactType;

                    return (
                        <span>
                            {
                                contact
                                    .phone
                                    .join(", ")
                            }
                        </span>
                    )
                },
                key: {
                    value: "name"
                }
            }
        ]
    )

    return (
        <Table 
            data={[]}
            headers={headers}
        />
    )
}

export default TableView