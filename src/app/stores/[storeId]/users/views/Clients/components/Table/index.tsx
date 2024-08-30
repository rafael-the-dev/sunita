import { useCallback, useContext } from "react";

import { CustomerInfoType } from "@/types/guest";

import { AppContext } from "@/context/AppContext"
import { FixedTabsContext as StaticContext } from "@/context/FixedTabsContext"
import { UsersPageContext } from "../../../../context";

import ClientForm from "../ClientForm"
import ClientsTable from "@/components/shared/table/ClientsTable";

const TableContainer = () => {
    const { fetchDataRef } = useContext(AppContext);
    const { setDialog } = useContext(StaticContext);
    const { customers } = useContext(UsersPageContext);

    const fetchCustomers = customers.fetchData;

    const rowClickHandler = useCallback(
        (customer: CustomerInfoType) => () => {
            fetchDataRef.current = fetchCustomers

            setDialog(
                {
                    header: {
                        title: "Register client"
                    },
                    body: <ClientForm />,
                    payload: customer
                }
            )
        },
        [ fetchCustomers, fetchDataRef, setDialog ]
    )

    const list = customers?.data?.list

    return (
        <ClientsTable 
            classes={{ root: "mt-6" }}
            data={list} 
            onClickRow={rowClickHandler}
        />
    )
}

export default TableContainer