import { MutableRefObject, useMemo, useRef } from "react";

import { CustomerInfoType, CustomerType } from "@/types/guest";
import { TableHeadersType } from "@/components/table/types";


import useSearchParams from "@/hooks/useSearchParams";

import Table from "..";

type PropsType = {
    classes?: { root?: string },
    data: CustomerInfoType[],
    headers?: MutableRefObject<TableHeadersType[]>,
    onClickRow?: (customer: CustomerInfoType) => () => void
}

const includesSearchKey = (value: string, searchKey: string) => value.toLowerCase().includes(searchKey) 

const ClientsTable = ({ classes, data, headers, onClickRow }: PropsType) => {
    const searchParams = useSearchParams();

    const searchKey = searchParams.get("search", "").toLowerCase()

    const defaultHeaders = useRef<TableHeadersType[]>([
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

    const customersList = useMemo(
        () => {
            if(!data) return []

            return data
                .filter(
                    customer => {
                        const fullName = `${customer.firstName} ${customer.lastName}`

                        return includesSearchKey(fullName, searchKey)
                    }
                )
        },
        [ data, searchKey ]
    )


    return (
        <Table 
            classes={classes}
            data={customersList} 
            headers={headers ?? defaultHeaders}
            onClickRow={onClickRow}
        />
    )
}

export default ClientsTable