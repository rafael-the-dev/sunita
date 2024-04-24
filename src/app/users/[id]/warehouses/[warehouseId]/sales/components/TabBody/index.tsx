import * as React from "react"
import classNames from "classnames"

import { SaleContext } from "@/context/SalesContext/context/SaleContext"
import { TableHeadersType } from "@/components/table/types"
import styles from "./styles.module.css"

import PaymentButton from "./components/payment-button"
import SearchField from "./components/search-field"
import Table from "@/components/shared/table"

const TabBody = () => {
    const { isEmpty, getCart } = React.useContext(SaleContext)
    const cart = getCart()
    
    const tableHeader = React.useRef<TableHeadersType[]>([
        {
            label: "Name",
            key: {
                value: "product",
                subKey: {
                    value: "name"
                }
            }
        },
        
        {
            label: "Available",
            key: {
                value: "product",
                subKey: {
                    value: "stock",
                    subKey: {
                        value: "quantity"
                    }
                }
            }
        },
        {
            label: "Quantity",
            key: {
                value: "quantity"
            }
        },
        {
            label: "Price",
            key: {
                value: "product",
                subKey: {
                    value: "sellPrice"
                }
            }
        },
        {
            label: "Total",
            key: {
                value: "total"
            }
        }
    ])

    return (
        <div className="pt-3">
            <div className="px-3">
                <SearchField />
            </div>
            <div className={classNames('px-3')}>
                {
                    !isEmpty && (
                        <Table
                            data={ cart.items }
                            headers={tableHeader}
                        />
                    )
                }
            </div>
            <div className={classNames(styles.footer, `bg-primary-50 bottom-0 fixed flex justify-end`)}>
                <PaymentButton />
            </div>
        </div>
    )
}

export default TabBody