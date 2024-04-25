import * as React from "react"
import classNames from "classnames"
import Typography from "@mui/material/Typography";

import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

import { SaleContext } from "@/context/SalesContext/context/SaleContext"
import { TableHeadersType, TableKeyType } from "@/components/table/types"
import { CartItem } from "@/types/cart";
import styles from "./styles.module.css"

import PaymentButton from "./components/payment-button"
import QuantityInput from "./components/quantity-input"
import SearchField from "./components/search-field"
import Table from "@/components/shared/table"
import { ProductInfoType } from "@/types/product";

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
            getComponent: ({ item, key }) => <QuantityInput cartItem={item as CartItem<ProductInfoType>} />,
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
                    isEmpty ? (
                        <div className="flex flex-col items-center justify-center h-[45vh]">
                            <RemoveShoppingCartIcon className="text-9xl" />
                            <Typography
                                component="h2"
                                className="font-bold mt-4 text-2xl">
                                Cart is empty
                            </Typography>
                        </div>
                    ) : (
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