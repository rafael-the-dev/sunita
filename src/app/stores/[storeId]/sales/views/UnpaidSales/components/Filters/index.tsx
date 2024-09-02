import * as React from "react"

import { CustomerType } from "@/types/guest"
import { TableHeadersType } from "@/components/table/types"

import { SalesContext } from "../../../../context"

import useSearchParams from "@/hooks/useSearchParams"

import SearchBox from "@/components/shared/Search/SearchWithOptions"
import { getFullName } from "@/helpers"

const toLowerCase = (customer: CustomerType) => getFullName(customer).toLowerCase()

const FiltersContainer = () => {
    const { customers } = React.useContext(SalesContext)

    const searchParams = useSearchParams()

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
    
    const getList = React.useCallback(//@ts-ignore
        (value: string) => {
            //@ts-ignore
            const list = (customers.data?.list ?? []) as CustomerType[]

            return list.filter(customer => {
                const fullName = toLowerCase(customer)

                return fullName.includes(value.toLowerCase())
            })
            },
        [ customers ]
    )

    const rowClickHandler = React.useCallback(
        (customer: CustomerType) => {
            const fullName = toLowerCase(customer)
                .replaceAll(" ", "-")

            searchParams.setSearchParam("search", fullName)
        },
        [ searchParams ]
    )

    return (
        <SearchBox 
            getList={getList}
            headers={headers}
            onClickRow={rowClickHandler}
            searchParam
        />
    )
}

export default FiltersContainer