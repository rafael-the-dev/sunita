import { useContext, useRef } from "react"

import { UsersContext } from "@/context/UsersContext"

import { STATUS } from "@/types"
import { TableHeadersType } from "@/components/table/types"
import { UserType } from "@/types/user"

import StatusContainer from "@/components/shared/Status"
import Table from "@/components/shared/table"

const TableContainer = () => {
    const { getUsers } = useContext(UsersContext)

    const headers = useRef<TableHeadersType[]>([
        {
            label: "Name",
            getComponent({ item }) {
                const user = item as UserType

                return (
                    <span>
                        { user.firstName } { user.lastName }
                    </span>
                )
            },
            key: {
                value: "firstName"
            }
        },
        {
            label: "Username",
            key: {
                value: "username"
            }
        },
        {
            label: "Position",
            getComponent({ item }) {
                const user = item as UserType

                return <span className="capitalize">{ user.stores[0].category }</span>
            },
            key: {
                subKey: {
                    value: "category"
                },
                value: "stores"
            }
        },
        {
            label: "Status",
            getComponent({ item }) {
                const user = item as UserType

                return <StatusContainer status={ user.stores[0]?.status as STATUS } />
            },
            key: {
                subKey: {
                    value: "status"
                },
                value: "stores"
            }
        }
    ])

    return (
        <Table 
            classes={{ root: "mt-6" }}
            data={getUsers()}
            headers={headers}
        />
    )
}

export default TableContainer