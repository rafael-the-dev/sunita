import * as React from "react"

import { CustomerInfoType, CustomerType } from "@/types/guest";
import { TableHeadersType } from "@/components/table/types";

import { SalesContext } from "@/context/SalesContext";

import SearchInput from "@/components/shared/Search/SearchWithOptions"

const Searchfield = ({ addCustomer }: { addCustomer: (customer: CustomerInfoType) => void }) => {
    const { getClients } = React.useContext(SalesContext)

    const clientsList = getClients()

    const headers = React.useRef<TableHeadersType[]>([
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

    const getList = React.useCallback(
        (value: string) => {
            return clientsList.filter(client => {
                const includesValue = `${client.firstName} ${client.lastName}`
                    .toLowerCase()
                    .includes(value);

                return includesValue
            })
        },
        [ clientsList ]
    )

    return (
        <SearchInput 
            getList={getList}
            headers={headers}
            input={
                {
                    label: "Insert client's name"
                }
            }
            onClickRow={addCustomer}
        />
    )
}

export default Searchfield