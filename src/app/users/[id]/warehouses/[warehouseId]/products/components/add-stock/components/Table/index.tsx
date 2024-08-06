import { ChangeEvent, useCallback, useContext, useRef } from "react"

import { SetterFuncType } from "@/context/StockContext/types";
import { TableHeadersType } from "@/components/table/types";

import { CartItem } from "@/types/cart";
import { ProductInfoType } from "@/types/product";

import { StockContext } from "@/context/StockContext";

import { isLessOrEqualToZero } from "@/helpers/stock-report";

import QuantityInput from "@/components/shared/quantity-input"
import Table from "@/components/shared/table"

const TableContainer = () => {
    const { 
        getCart, getStockReport,
        hasErrors,
        removeItem, reset,
        setDate, setQuantity, setReference, setSellPrice, setTotal,
        toString 
    } = useContext(StockContext)

    const changeHandler = useCallback((product: ProductInfoType, func: SetterFuncType) => (e: ChangeEvent<HTMLInputElement>) => {
        func(product, e.target.value, "CHANGE");
    }, [])

    const headers = useRef<TableHeadersType[]>([
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
            label: "Quantity",
            getComponent: ({ item }) => {
                const cartItem = item as CartItem<ProductInfoType>;
                return (
                    <QuantityInput 
                        hasError={isLessOrEqualToZero(cartItem.quantity)}
                        onChange={changeHandler(cartItem.product, setQuantity)}
                        onDecrement={() => setQuantity(cartItem.product, -1)}
                        onIncrement={() => setQuantity(cartItem.product, 1)}
                        value={cartItem.quantity}
                    />
                )
            },
            key: {
                value: "quantity"
            }
        },
        {
            label: "Total",
            getComponent: ({ item }) => {
                const cartItem = item as CartItem<ProductInfoType>;
                return (
                    <QuantityInput 
                        hasError={isLessOrEqualToZero(cartItem.total)}
                        onChange={changeHandler(cartItem.product, setTotal)}
                        onDecrement={() => setTotal(cartItem.product, -1)}
                        onIncrement={() => setTotal(cartItem.product, 1)}
                        value={cartItem.total}
                    />
                )
            },
            key: {
                value: "total"
            }
        },
        {
            label: "Purchase price",
            key: {
                value: "product",
                subKey: {
                    value: "purchasePrice"
                }
            }
        },
        {
            label: "Sell price",
            getComponent: ({ item }) => {
                const cartItem = item as CartItem<ProductInfoType>;
                return (
                    <QuantityInput 
                        hasError={isLessOrEqualToZero(cartItem.product.sellPrice) || cartItem.product.purchasePrice >= cartItem.product.sellPrice}
                        onChange={changeHandler(cartItem.product, setSellPrice)}
                        onDecrement={() => setSellPrice(cartItem.product, -1)}
                        onIncrement={() => setSellPrice(cartItem.product, 1)}
                        value={cartItem.product.sellPrice}
                    />
                )
            },
            key: {
                value: "product",
                subKey: {
                    value: "sellPrice"
                }
            }
        },
        {
            label: "Profit",
            key: {
                value: "product",
                subKey: {
                    value: "profit"
                }
            }
        },
        {
            label: "Remove",
            key: {
                value: "delete"
            }
        }
    ]);

    const removeHandler = useCallback((row: CartItem<ProductInfoType>) => () => removeItem(row.product.id), [ removeItem ]);

    return (
        <Table 
            data={getCart().items}
            headers={headers}
            onRemoveRow={removeHandler}
        />
    )
}

export default TableContainer