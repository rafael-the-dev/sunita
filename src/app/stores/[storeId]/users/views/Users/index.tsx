"use client"

import { useCallback, useContext, useEffect } from "react"

import { AppContext } from "@/context/AppContext"
import { UsersContext } from "@/context/UsersContext"
import { LoginContext } from "@/context/LoginContext"

import useSearchParams from "@/hooks/useSearchParams"

import Button from "@/components/shared/button"
import Filters from "./components/Filters"
import Table from "./components/Table"
import UserForm from "@/components/Form/RegisterUser"

enum DIALOG_PARAMS {
    REGISTER_USER = "register-user"
}

const UsersView = () => {
    const { setDialog } = useContext(AppContext)
    const { credentials } = useContext(LoginContext)
    const { loading } = useContext(UsersContext)

    const searchParams = useSearchParams()

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
        <div className="flex flex-col h-full justify-between px-2 md:mb-4 md:px-4 md:pb-0">
            <div className="flex flex-col items-stretch">
                <Filters />
                <Table />
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
    )
}

export default UsersView