"use client"

import { useCallback, useContext, useEffect, useRef } from "react"
import classNames from "classnames"

import styles from "./styles.module.css"

import { TableHeadersType } from "@/components/table/types"
import { STATUS } from "@/types"
import { UserType } from "@/types/user"

import { AppContext } from "@/context/AppContext"
import { UsersContext, UsersContextProvider } from "@/context/UsersContext"
import { LoginContext } from "@/context/LoginContext"

import useSearchParams from "@/hooks/useSearchParams"

import Button from "@/components/shared/button"
import Filters from "./components/Filters"
import Table from "@/components/shared/table"
import StatusContainer from "@/components/shared/Status"
import UserForm from "@/components/Form/RegisterUser"

enum DIALOG_PARAMS {
    REGISTER_USER = "register-user"
}

const UsersPage = () => {
    const { setDialog } = useContext(AppContext)
    const { credentials } = useContext(LoginContext)
    const { getUsers, loading } = useContext(UsersContext)

    const searchParams = useSearchParams()

    const headers = useRef<TableHeadersType[]>([
        {
            label: "Name",
            getComponent({ item, key }) {
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

    const registerClickHandler = useCallback(
        () => searchParams.setSearchParam("dialog", DIALOG_PARAMS.REGISTER_USER.toString()),
        [ searchParams ]
    )

    const openUserFormDialog = useCallback(() => {
        const url = `/api/stores/${credentials?.user?.stores[0]?.storeId}/users`

        setDialog({
            header: {
                title: "Register user"
            },
            body: <UserForm url={url} />
        })
    }, [ credentials, setDialog ])

    const dialog = searchParams.get("dialog", "")

    useEffect(
        () => {
            if(dialog === DIALOG_PARAMS.REGISTER_USER) {
                openUserFormDialog()
            }
        }, 
        [ dialog, openUserFormDialog ]
    )

    if(loading) return (
        <h2 className="font-bold text-2xl">Loading...</h2>
    )

    return (
        <main className="scrollable--secondary">
            <div className="flex flex-col h-full justify-between pt-8 pb-12 px-2 md:mb-4 md:px-4 md:pb-0">
                <div>
                    <Filters />
                    <Table 
                        classes={{ root: "mt-6", table: classNames(styles.table) }}
                        data={getUsers()}
                        headers={headers}
                    />
                </div>
                <div className="flex flex-col gap-y-4 mt-36 sm:flex-row sm:justify-end sm:gap-y-0 sm:gap-x-4 md:mt-6">
                    <Button className="py-2" variant="outlined">
                        Pay salaries
                    </Button>
                    <Button
                        className="py-2"
                        onClick={registerClickHandler}>
                        Register
                    </Button>
                </div>
            </div>
        </main>
    )
}

const ContextProvider = () => <UsersContextProvider><UsersPage /></UsersContextProvider>

export default ContextProvider