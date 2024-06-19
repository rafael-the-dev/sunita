import * as React from "react"
import classNames from "classnames";

import styles from "./styles.module.css"

import { TableHeadersType } from "@/components/table/types";

import { AnalyticsFiltersContext } from "@/context/AnalyticsFilters";
import { ProductInfoType } from "@/types/product";

import useFech from "@/hooks/useFetch";
import useSearchParams from "@/hooks/useSearchParams";
import useDataMemo from "@/hooks/useDataMemo";


import CategoriesCombobox from "@/components/shared/combobox"
import Input from "@/components/Textfield";
import Table from "@/components/shared/table";

const ProductSearchField = () => {
    const { getCategories, getData, setData } = React.useContext(AnalyticsFiltersContext);

    const fetchProductsResult = useFech<ProductInfoType[]>({ 
        autoFetch: false, 
        url: "/api/stores/12345/products" 
    });
    const { fetchData, loading } = fetchProductsResult;

    const searchParams = useSearchParams()
    const category = searchParams.get("category", -1);
    const searchKey = searchParams.get("search", "");

    const headers = React.useRef<TableHeadersType[]>([
        { key: { value: "select_product" }, label: "Selected" },
        { key: { value: "name" }, label: "Bar code" },
        { key: { value: "barcode" }, label: "Name" },
        { key: { value: "sellPrice" }, label: "Price" }
    ]);

    const data = React.useMemo(() => {
        const list = getData<ProductInfoType[]>("products")

        if(list.length > 0) return list;

        return fetchProductsResult.data;
    }, [ fetchProductsResult, getData ])

    const products = React.useMemo(() => {
        let list = data;

        if(!data) return [];
        
        if(category && typeof category === "string") {
            list = data.filter(item => item.category === category);
        }

        if(searchKey.trim()) {
            list = data.filter(item => {
                const isName = item.name.toLowerCase().includes(searchKey.toLowerCase());
                const isBarCode = item.barcode.includes(searchKey);

                return isName || isBarCode;
            })
        }

        return list;
    }, [ category, data, searchKey ]);

    const changeHandler = React.useCallback((key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        searchParams.setSearchParam(key, e.target.value)
    }, [ searchParams ]);

    const tableRowChangeHandler = React.useCallback((row: ProductInfoType) =>  () => {
        searchParams.setSearchParams("product", row.id);
    }, [ searchParams ]);

    const categoriesMemo = React.useMemo(() => {
        return ( 
            <CategoriesCombobox 
                className={classNames(styles.categories)} 
                list={getCategories()}
                value={category} 
                onChange={changeHandler("category")} 
            />
        )
    }, [ category, getCategories, changeHandler ]);

    
    const searchMemo = React.useMemo(() => (
        <Input 
            className={classNames(styles.searchField)}
            label="Search"
            onChange={changeHandler("search")}
            required
            value={searchKey}
            variant="outlined"
        />
    ), [ changeHandler, searchKey ]);

    useDataMemo<ProductInfoType[]>({
        data: fetchProductsResult.data,
        fetchData,
        getData,
        key: "products",
        setData
    })

    return (
        <div>
            <div className="flex flex-wrap justify-between">
                { searchMemo }
                { categoriesMemo }
            </div>
            <Table 
                data={products} 
                headers={headers}
                onChange={tableRowChangeHandler}
            />
        </div>
    );
};

export default ProductSearchField;