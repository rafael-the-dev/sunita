import * as React from "react"

import { AppContext } from "@/context/AppContext"
import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext"

import useSearchParams from "@/hooks/useSearchParams"

import Button from "@/components/shared/button"
import StoresForm from "./store-components/Form"
import Table from "./store-components/Table"

enum DIALOG_TYPES {
    STORE_FORM = "store-form"
}

const StoresView = () => {
    const { fetchDataRef } = React.useContext(AppContext)
    const { setDialog } = React.useContext(StaticTabsContext)

    const searchParams = useSearchParams()

    const dialogQueryParam = searchParams.get("dialog", "")

    const openFormDialog = React.useCallback(
        () => {
            setDialog(
                {
                    header: {
                        title: "Stores form"
                    },
                    body: <StoresForm />
                }
            )
        },
        [ setDialog ]
    )

    const clickHandler = React.useCallback(
        () => searchParams.setSearchParam("dialog", DIALOG_TYPES.STORE_FORM),
        [ searchParams ]
    )
    

    React.useEffect(
        () => {
            if(dialogQueryParam === DIALOG_TYPES.STORE_FORM) openFormDialog()
        },
        [ dialogQueryParam, openFormDialog ]
    )

    return (
        <div className="flex flex-col h-full justify-between w-full">
            <div className="flex flex-col items-stretch">
                <Table />
            </div>
            <div className="flex flex-col items-stretch mt-8 w-full sm:flex-row sm:justify-end">
                <Button
                    className="py-2"
                    onClick={clickHandler}>
                    Register
                </Button>
            </div>
        </div>
    )
}

export default StoresView