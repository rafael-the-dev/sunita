import * as React from "react"
import classNames from "classnames";

import styles from "./styles.module.css"

import { TableHeadersType } from "@/components/table/types";

import CategoriesCombobox from "@/components/shared/combobox"
import Input from "@/components/Textfield";
import Table from "@/components/shared/table";
import { AnalyticsFiltersContext } from "@/context/AnalyticsFilters";
import useSearchParams from "@/hooks/useSearchParams";
import { ProductInfoType } from "@/types/product";

const ProductSearchField = () => {
    const { getCategories, getProducts } = React.useContext(AnalyticsFiltersContext);
    const searchParams = useSearchParams()

    const category = searchParams.get("category", -1);
    const searchKey = searchParams.get("search", "");

    const headers = React.useRef<TableHeadersType[]>([
        { key: { value: "select_product" }, label: "Selected" },
        { key: { value: "name" }, label: "Bar code" },
        { key: { value: "barcode" }, label: "Name" },
        { key: { value: "sellPrice" }, label: "Price" }
    ]);

    const products = React.useMemo(() => {
        let list = getProducts();
        
        if(category && typeof category === "string") {
            list = list.filter(item => item.category === category);
        }

        if(searchKey.trim()) {
            list = list.filter(item => {
                const isName = item.name.toLowerCase().includes(searchKey.toLowerCase());
                const isBarCode = item.barcode.includes(searchKey);

                return isName || isBarCode;
            })
        }

        return list;
    }, [ category, getProducts, searchKey ]);

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