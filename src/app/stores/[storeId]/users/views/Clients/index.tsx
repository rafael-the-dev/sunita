import { useCallback, useContext, useEffect } from "react"

import { AppContext } from "@/context/AppContext"
import { FixedTabsContext as StaticContext } from "@/context/FixedTabsContext"
import { UsersPageContext } from "../../context"

import useSearchParams from "@/hooks/useSearchParams"

import Button from "@/components/shared/button"
import ClientForm from "./components/ClientForm"
import Filters from "./components/Filters"
import Table from "./components/Table"

enum DIALOG {
    REGISTER_CLIENT = "client-form"
}

const ClientsView = () => {
    const { fetchDataRef } = useContext(AppContext);
    const { setDialog } = useContext(StaticContext);
    const { customers } = useContext(UsersPageContext);

    const searchParams = useSearchParams();
    const dialog = searchParams.get("dialog", "");

    const fetchCustomers = customers.fetchData;

    const openClientForm = useCallback(
        () => {
            fetchDataRef.current = fetchCustomers

            setDialog(
                {
                    header: {
                        title: "Register client"
                    },
                    body: <ClientForm />
                }
            )
        },
        [ fetchCustomers, fetchDataRef, setDialog ]
    )

    const registerClientClickHandler = useCallback(
        () => searchParams.setSearchParam("dialog", DIALOG.REGISTER_CLIENT),
        [ searchParams ]
    )

    useEffect(
        () => {
            if(dialog === DIALOG.REGISTER_CLIENT) openClientForm();
        },
        [ dialog, openClientForm ]
    )

    return (
        <div className="flex flex-col h-full justify-between px-2 md:mb-4 md:px-4 md:pb-0">
            <div className="flex flex-col items-stretch">
                <Filters />
                <Table />
            </div>
            <div className="flex flex-col items-stretch mt-8 sm:flex-row sm:justify-end">
                <Button
                    className="py-2"
                    onClick={registerClientClickHandler}>
                    Register client
                </Button>
            </div>
        </div>
    )
}

export default ClientsView