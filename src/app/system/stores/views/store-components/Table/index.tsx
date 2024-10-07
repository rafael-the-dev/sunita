import * as React from "react"

import { Store } from "@/types/warehouse"
import { TableHeadersType } from "@/components/table/types"

import { AppContext } from "@/context/AppContext";
import {StoresContext} from "../../../context"
import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext";

import Status from "@/components/shared/Status"
import StoresForm from "../Form"
import Table from "@/components/shared/table"

const TableView = () => {
    const { fetchDataRef } = React.useContext(AppContext);
    const { setDialog } = React.useContext(StaticTabsContext);
    const { stores } = React.useContext(StoresContext)

    const fetchStoresFuncRef = stores.fetchData;

    const headers = React.useRef<TableHeadersType[]>(
        [
            {
                label: "Name",
                key: {
                    value: "name"
                }
            },
            {
                label: "Contact",
                getComponent({ item }) {
                    const store = item as Store;

                    return (
                        <span>
                            {
                                store
                                    .contact
                                    .phone
                                    .map(contact => contact.number)
                                    .join(", ")
                            }
                        </span>
                    )
                },
                key: {
                    value: "name"
                }
            },
            {
                label: "Status",
                getComponent({ item }) {
                    const store = item as Store;

                    return <Status status={store.status} />
                },
                key: {
                    value: "status"
                }
            }
        ]
    )

    const openFormDialog = React.useCallback(
        (payload: Store) => () => {
            fetchDataRef.current = fetchStoresFuncRef

            setDialog(
                {
                    header: {
                        title: "Stores form"
                    },
                    body: <StoresForm />,
                    payload
                }
            )
        },
        [ fetchDataRef, fetchStoresFuncRef, setDialog ]
    )

    const storesList = stores?.data?.data ?? []

    return (
        <Table 
            data={storesList}
            headers={headers}
            onClickRow={openFormDialog}
        />
    )
}

export default TableView