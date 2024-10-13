import { MutableRefObject, useMemo, useRef } from "react";

import { CustomerInfoType, CustomerType } from "@/types/guest";
import { TableHeadersType } from "@/components/table/types";

import contactLang from "@/lang/contact.json"
import lang from "@/lang/user.json"

import useLanguage from "@/hooks/useLanguage"

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

    const { language } = useLanguage()

    const searchKey = searchParams.get("search", "").toLowerCase()

    const defaultHeaders = useRef<TableHeadersType[]>([
        {
            label: lang["name"]["label"][language],
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
            label: contactLang["label"][language],
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
            label: `Doc ${contactLang["type"][language]}`,
            key: {
                value: "document",
                subKey: {
                    value: "type"
                }
            }
        },
        {
            label: `Doc ${contactLang["number"]["label"][language]}`,
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