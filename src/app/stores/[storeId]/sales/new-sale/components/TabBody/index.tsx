import * as React from "react"
import currency from "currency.js";
import classNames from "classnames"
import Typography from "@mui/material/Typography";

import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

import styles from "./styles.module.css"

import { SaleContext } from "@/context/SalesContext/context/SaleContext"
import { TableHeadersType, TableKeyType } from "@/components/table/types"
import { CartItem } from "@/types/cart";
import { ProductInfoType } from "@/types/product";

import PaymentButton from "./components/payment-button"
import QuantityInput from "@/components/shared/quantity-input"
import SearchField from "./components/search-field"
import Table from "@/components/shared/table"
import { isInvalidNumber } from "@/helpers/validation";

const TabBody = () => {
    const { 
        addItem, 
        changeQuantity,
        isEmpty, 
        getCart, 
        removeItem 
    } = React.useContext(SaleContext);

    const cart = getCart()

    const clickHandler = React.useCallback((cartItem: CartItem<ProductInfoType>, value: number) => () => addItem(cartItem.product, value), [ addItem ]);
    
    const changeHandler = React.useCallback((cartItem: CartItem<ProductInfoType>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = currency(e.target.value).value;
        changeQuantity(cartItem.product.id, quantity);
    }, [ changeQuantity ]);

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
            getComponent: ({ item, key }) => {
                const cartItem = item as CartItem<ProductInfoType>

                return (
                    <QuantityInput 
                        hasError={isInvalidNumber(cartItem.quantity) || cartItem.quantity > cartItem.product.stock.quantity}
                        onChange={changeHandler(cartItem)}
                        onDecrement={clickHandler(cartItem, -1)}
                        onIncrement={clickHandler(cartItem, 1)}
                        value={cartItem.quantity}
                    />
                )
            },
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
        },
        {
            label: "Remove",
            key: {
                value: "delete"
            }
        }
    ]);

    const rowDeleteHandler = React.useCallback((cartItem: CartItem<ProductInfoType>)  => () => {
        removeItem(cartItem.product.id)
    }, [ removeItem ]);

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
                            onRemoveRow={rowDeleteHandler}
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