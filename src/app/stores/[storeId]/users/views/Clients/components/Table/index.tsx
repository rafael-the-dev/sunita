import { useCallback, useContext } from "react";

import { LANGUAGE } from "@/types/language"
import { CustomerInfoType } from "@/types/guest";

import { AppContext } from "@/context/AppContext"
import { FixedTabsContext as StaticContext } from "@/context/FixedTabsContext"
import { UsersPageContext } from "../../../../context";

import useLanguage from "@/hooks/useLanguage"

import ClientForm from "../ClientForm"
import ClientsTable from "@/components/shared/table/ClientsTable";

const TableContainer = () => {
    const { fetchDataRef } = useContext(AppContext);
    const { setDialog } = useContext(StaticContext);
    const { customers } = useContext(UsersPageContext);

    const { translate } = useLanguage()

    const fetchCustomers = customers.fetchData;

    const rowClickHandler = useCallback(
        (customer: CustomerInfoType) => () => {
            fetchDataRef.current = fetchCustomers

            setDialog(
                {
                    header: {
                        title: translate({ [LANGUAGE.ENGLISH]: "Update client", [LANGUAGE.PORTUGUESE]: "Atualizar cliente" })
                    },
                    body: <ClientForm />,
                    payload: customer
                }
            )
        },
        [ fetchCustomers, fetchDataRef, setDialog, translate ]
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