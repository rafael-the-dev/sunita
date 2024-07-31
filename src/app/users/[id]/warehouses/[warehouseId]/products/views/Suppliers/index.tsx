import * as React from "react"

import { AppContext } from "@/context/AppContext"

import useDialog from "@/hooks/useDialog"

import { FixedTabsContext as StaticContext } from "@/context/FixedTabsContext"

import Button from "@/components/shared/button"
import Form from "./components/SupplierForm"
import SearchBox from "./components/SearchBox"
import Table from "./components/Table"

enum DIALOG_TYPES {
    REGISTER = "register"
}

const SuppliersContainer = () => {
    const { changeDialog, dialog } = useDialog()

    const { setDialog } = React.useContext(StaticContext)

    const openRegisterDialog = React.useCallback(
        (title: string, payload?: Object) => {
            setDialog(
                {
                    header: {
                        title
                    },
                    body: <Form />,
                    payload
                }
            )
        },
        [ setDialog ]
    )

    const clickHandler = React.useCallback(
        (dialog: DIALOG_TYPES) => () => changeDialog(dialog),
        [ changeDialog ]
    )

    React.useEffect(
        () => {
            if(dialog === DIALOG_TYPES.REGISTER) openRegisterDialog("Register Supplier")
        },
        [ dialog, openRegisterDialog ]
    )

    return (
        <div className="flex flex-col h-full items-stretch justify-between">
            <div>
                <SearchBox />
                <Table />
            </div>
            <div className="flex flex-col items-stretch sm:flex-row sm:justify-end">
                <Button
                    className="py-2"
                    onClick={clickHandler(DIALOG_TYPES.REGISTER)}>
                    Regist supplier
                </Button>
            </div>
        </div>
    )
}

export default SuppliersContainer