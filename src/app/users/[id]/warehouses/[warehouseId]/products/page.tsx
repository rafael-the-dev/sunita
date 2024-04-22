"use client";

import * as React from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

import { ProductInfoType } from "@/types/product";

import Main from "@/components/main";
import RegisterProduct from "./components/register-product";
import SearchBox from "@/components/shared/product-search-box";
import Table from "@/components/shared/table";
import { TableHeadersType } from "@/components/table/types";


const Container = () => {
    const [ productsList, setProductsList ] = React.useState<ProductInfoType[] | null>(null);

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
                value: "price"
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

    const fetchData = React.useCallback(async ({ signal }: { signal: AbortSignal }) => {
        const res = await fetch("http://localhost:3000/api/users/rafaeltivane/warehouses/12345/products", { signal });
        const data = await res.json() as ProductInfoType[];
        setProductsList(data);
    }, []);

    React.useEffect(() => {
        const controller = new AbortController();

        fetchData({ signal: controller.signal});

        return () => {
            controller.abort;
        }
        
    }, [ fetchData ])

    return (
        <Main className="flex flex-col items-stretch justify-between">
            <div className="px-3">
                <form>
                    <SearchBox className="pr-2 rounded-md">
                        <SearchBox.Filters />
                        <SearchBox.Input 
                            className="grow"
                            placeholder="Insert product's name"
                        />
                    </SearchBox>
                </form>
                <div className={classNames(styles.body, `mt-6 table-body`)}>
                    { productsList && <Table 
                        data={productsList}
                        headers={headers}
                    /> }
                </div>
            </div>
            <div className="flex justify-end px-3">
                <RegisterProduct />
            </div>
        </Main>
    );
};

export default Container;