"use client";

import * as React from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

import { ProductInfoType } from "@/types/product";
import { AppContext } from "@/context/AppContext";
import { ProductFilterContext, ProductFilterContextProvider  } from "@/context/ProductFilterContext";

import DialogBody from "./components/register-product/components/body";
import Main from "@/components/main";
import RegisterProduct from "./components/register-product";
import SearchBox from "@/components/shared/product-search-box";
import Table from "@/components/shared/table";
import { TableHeadersType } from "@/components/table/types";
import useFechProducts from "@/hooks/useFetchProducts";

const Container = () => {
    const { setDialog } = React.useContext(AppContext);
    const { category, price, searchKey, setUniqueSearchParams } = React.useContext(ProductFilterContext);

    const { data, fetchProducts } = useFechProducts()

    const productsList = React.useMemo(() => data ?? [], [ data ])

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

    const changeHandler = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => setUniqueSearchParams("search-key", e.target.value), [ setUniqueSearchParams ]);

    const rowClickHandler = React.useCallback((row: ProductInfoType) => () => {
        setDialog({
            header: { title: "Update product" },
            body: <DialogBody />,
            payload: row
        });
    }, [ setDialog ]);

    return (
        <Main className="flex flex-col items-stretch justify-between">
            <div className="px-3">
                <form>
                    <SearchBox className="pr-2 rounded-md">
                        <SearchBox.Filters />
                        <SearchBox.Input 
                            className="grow"
                            onChange={changeHandler}
                            placeholder="Insert product's name"
                        />
                    </SearchBox>
                </form>
                <div className={classNames(styles.body, `mt-6 table-body`)}>
                    { productsList && <Table 
                        data={productsListFiltered}
                        headers={headers}
                        onClickRow={rowClickHandler}
                    /> }
                </div>
            </div>
            <div className="flex justify-end px-3">
                <RegisterProduct />
            </div>
        </Main>
    );
};

const ProductsPage = () => {

    return (
        <ProductFilterContextProvider>
            <Container />
        </ProductFilterContextProvider>
    )
}

export default ProductsPage;