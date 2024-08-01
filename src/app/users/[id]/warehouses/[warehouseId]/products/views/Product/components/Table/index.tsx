import * as React from "react";

import { ProductInfoType } from "@/types/product";
import { TableHeadersType } from "@/components/table/types";

import { AppContext } from "@/context/AppContext";
import { ProductsPageContext } from "../../../../context"
import { ProductFilterContext } from "@/context/ProductFilterContext";

import DialogBody from "../../../../components/register-product/components/body";
import Table from "@/components/shared/table";

const ProductsTableContainer = () => {
    const { setDialog } = React.useContext(AppContext);
    const { products } = React.useContext(ProductsPageContext)
    const { category, price, searchKey, setUniqueSearchParams } = React.useContext(ProductFilterContext);

    const { data } = products;

    const headers = React.useRef<TableHeadersType[]>([
        {
            label: "Name",
            key: {
                value: "name"
            }
        },
        {
            label: "Barcode",
            key: {
                value: "barcode"
            }
        },
        {
            label: "Category",
            key: {
                value: "category"
            }
        },
        {
            label: "Price",
            key: {
                value: "sellPrice"
            }
        },
        {
            label: "Quantity",
            key: {
                value: "stock",
                subKey: {
                    value: "quantity"
                }
            }
        }
    ]);

    const productsList = React.useMemo(() => data ?? [], [ data ])

    const productsListFiltered = React.useMemo(() => {
        if(category.length > 0 || price.min || price.max || searchKey.trim()) {
            let list = productsList ?? [];

            list = list.filter(product => {
                let isSelected = false;
                
                if(searchKey.trim() && product.name?.toLowerCase()?.includes(searchKey.toLowerCase())) {
                    isSelected = true;
                }

                if(category) {
                    if(Array.isArray(category) && category.length > 0 && category.includes(product?.category?.toUpperCase())) {
                        isSelected = true;
                    }
                }

                // return product if product's price greater than or equals to price.min and if product is less than or equals to price.max
                if((product.sellPrice >= price.min) && (product.sellPrice <= price.max)) isSelected = true;

                return isSelected;
            });

            return list;
        }

        return productsList;
    }, [ category, price, productsList, searchKey ])

    const rowClickHandler = React.useCallback((row: ProductInfoType) => () => {
        setDialog({
            header: { title: "Update product" },
            body: <DialogBody />,
            payload: row
        });
    }, [ setDialog ]);

    return (
        <Table 
            data={productsListFiltered}
            headers={headers}
            onClickRow={rowClickHandler}
        />
    )
}

export default ProductsTableContainer