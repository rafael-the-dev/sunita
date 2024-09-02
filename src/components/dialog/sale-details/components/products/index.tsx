import * as React from "react"

import { SaleContext } from "@/context/SalesContext/context/SaleContext";
import { SaleDetailsContext } from "../../context";

import { CartItem } from "@/types/cart";
import { ProductInfoType } from "@/types/product"
import { TableHeadersType } from "@/components/table/types";

import QuantityInput from "@/components/Input/QuantityInput"
import Table from "@/components/shared/table";

const ProductsContainer = () => {
    const { 
        changeQuantity,
        getSaleDetails,
        increment
    } = React.useContext(SaleDetailsContext);

    const changeHandler = React.useCallback((productId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        changeQuantity(productId, e.target.value);
    }, [ changeQuantity ])

    const incrementHandler = React.useCallback((productId: string, value: number) => () => increment(productId, value), [ increment ]);

    const headers = React.useRef<TableHeadersType[]>([ 
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
            getComponent({ item, key }) {
                const cartItem = item as CartItem<ProductInfoType>;
                const productId = cartItem.product.id;

                return (
                    <QuantityInput 
                        hasError={false}
                        onChange={changeHandler(productId)}
                        onDecrement={incrementHandler(productId, -1)}
                        onIncrement={incrementHandler(productId, 1)}
                        value={cartItem.quantity}
                    />
                )
            },
            key: {
                value: ""
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

    return (
        <Table 
            headers={headers}
            data={getSaleDetails().items}
        />
    )
}

export default ProductsContainer