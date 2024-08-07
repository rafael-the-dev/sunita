import * as React from "react"

import { AppContext } from "@/context/AppContext"

import useDialog from "@/hooks/useDialog"

import { FixedTabsContext as StaticContext } from "@/context/FixedTabsContext"
import { ProductsPageContext } from "../../context"

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
    const { suppliers } = React.useContext(ProductsPageContext)

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

    const { data, fetchData } = suppliers;

    React.useEffect(
        () => {
            const controller = new AbortController();

            if(!data) {
                fetchData({ signal: controller.signal });
            }

            return () => controller.abort();
        },
        [ data, fetchData ]
    )

    return (
        <div className="flex flex-col h-full items-stretch justify-between">
            <div className="flex flex-col items-stretch">
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