import { useCallback, useContext, useRef } from "react";

import { CustomerInfoType, CustomerType } from "@/types/guest";
import { TableHeadersType } from "@/components/table/types";

import { AppContext } from "@/context/AppContext"
import { FixedTabsContext as StaticContext } from "@/context/FixedTabsContext"
import { UsersPageContext } from "../../../../context";

import useSearchParams from "@/hooks/useSearchParams";

import ClientForm from "../ClientForm"
import Table from "@/components/shared/table";

const TableContainer = () => {
    const { fetchDataRef } = useContext(AppContext);
    const { setDialog } = useContext(StaticContext);
    const { customers } = useContext(UsersPageContext);

    const searchParams = useSearchParams();

    const dialog = searchParams.get("dialog", "");
    const fetchCustomers = customers.fetchData;

    const headers = useRef<TableHeadersType[]>([
        {
            label: "Name",
            getComponent({ item }) {
                const customer = item as CustomerType;

                return (
                    <span>
                        { customer.firstName } { customer.lastName }
                    </span>
                )
            },
            key: {
                value: "firstName"
            }
        },
        {
            label: "Contact",
            getComponent({ item }) {
                const customer = item as CustomerType

                return (
                    <span className="capitalize">
                        { 
                            customer
                                .contact
                                .phone
                                .map(phone => phone.number)
                                .join(", ") 
                        }
                    </span>
                )
            },
            key: {
                value: "stores"
            }
        },
        {
            label: "Doc type",
            key: {
                value: "document",
                subKey: {
                    value: "type"
                }
            }
        },
        {
            label: "Doc number",
            key: {
                value: "document",
                subKey: {
                    value: "number"
                }
            }
        }
    ])

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


    return (
        <Table 
            classes={{ root: "mt-6" }}
            data={customers.data?.list ?? []} 
            headers={headers}
            onClickRow={rowClickHandler}
        />
    )
}

export default TableContainer