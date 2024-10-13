import { useContext, useMemo } from "react"

import { UsersContext } from "@/context/UsersContext"

import { LANGUAGE } from "@/types/language"
import { STATUS } from "@/types"
import { UserType } from "@/types/user"

import lang from "@/lang/user.json"

import useLanguage from "@/hooks/useLanguage"

import StatusContainer from "@/components/shared/Status"
import Table from "@/components/shared/table"


const TableContainer = () => {
    const { getUsers } = useContext(UsersContext)

    const { language } = useLanguage()

    const headers = useMemo(
        () => (
            {
                current: [
                    {
                        label: lang["name"]["label"][language],
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
                        label: lang["username"]["label"][language],
                        key: {
                            value: "username"
                        }
                    },
                    {
                        label: lang["position"]["label"][language],
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
                        label: lang["status"]["label"][language],
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
                ]
            }
        ),
        [ language ]
    )

    return (
        <Table 
            classes={{ root: "mt-6" }}
            data={getUsers()}
            headers={headers}
        />
    )
}

export default TableContainer