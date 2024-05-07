import * as React from "react";
import { v4 as uuidV4 } from "uuid";

import { SaleContext } from "@/context/SalesContext/context/SaleContext";

import { CartItem } from "@/types/cart";
import { ProductInfoType } from "@/types/product"
import { TableHeadersType } from "@/components/table/types";

import QuantityInput from "@/components/shared/quantity-input"
import Table from "@/components/shared/table";
import { SaleDetailsContext } from "@/context/SaleDetailsContext";

const ProductsContainer = () => {
    const { getSaleDetails } = React.useContext(SaleDetailsContext);

    const itemsList = React.useMemo(() => getSaleDetails().items.map(item => ({ ...item, id: uuidV4() })), [ getSaleDetails ]);

    const headers = React.useRef<TableHeadersType[]>([ 
        { 
            label: "Name",
            key: {
                value: "name"
            }
         },
        { 
            label: "Quantity", 
            getComponent({ item, key }) {
                const cartItem = item as CartItem<ProductInfoType>;

                return (
                    <QuantityInput 
                        hasError={false}
                        onChange={() => {}}
                        onDecrement={() => {}}
                        onIncrement={() => {}}
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
        }
    ]);

    return (
        <Table 
            headers={headers}
            data={itemsList}
        />
    )
}

export default ProductsContainer