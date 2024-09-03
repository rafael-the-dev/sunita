import { ChangeEvent, useCallback, useContext, useMemo, useRef, useState } from "react";

import styles from "./styles.module.css"

import { TableHeadersType } from "@/components/table/types";

import { ProductsPageContext } from "@/app/stores/[storeId]/products/context"

import useSearchParamsHook from "@/hooks/useSearchParams"

import Filters from "@/components/shared/filters";
import { ProductInfoType } from "@/types/product";


const includesValue = (searchField: string, value: string) => {
    return searchField.toLowerCase().includes(value)
} 

const SearchFieldContainer = () => {
    const { products } = useContext(ProductsPageContext)

    const searchParams = useSearchParamsHook();

    const headers = useRef<TableHeadersType[]>([
        {
            key: {
                value: "select_product"
            },
            label: "Select"
        },
        {
            key: {
                value: "barcode"
            },
            label: "Barcode"
        },
        {
            key: {
                value: "name"
            },
            label: "Name"
        }
    ]);

    const { data, loading } = products;

    const value = searchParams.get("search", "");
    
    const stockReportsList = useMemo(() => {
        if(!data || !value.trim()) return [];

        const valueLoweredCase = value.toLocaleLowerCase();

        return data.filter(product => {
            const isValueInBarcode = includesValue(product.barcode, valueLoweredCase);
            const isValueInCategory = includesValue(product.category, valueLoweredCase);
            const isValueInName = includesValue(product.name, valueLoweredCase);

            return isValueInBarcode || isValueInCategory || isValueInName;
        })
    }, [ data, value ]);
    

    const changeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => searchParams.setSearchParam("search", e.target.value), [ searchParams ]);
    const rowChangeHandler = useCallback((product: ProductInfoType) => () => searchParams.setSearchParams("product", product.id), [ searchParams ]);

    const hasItems = value.trim() && data && data.length >= 1;

    if(loading) return <p>Loading...</p>;

    return (
        <Filters.SearchField 
            classes={
                {
                    table: {
                        container: styles.tableContainer
                    }
                }
            }
            headers={headers}
            data={stockReportsList}
            hasItems={hasItems}
            onChange={changeHandler}
            onRowChange={rowChangeHandler}
        />
    )
};

export default SearchFieldContainer;