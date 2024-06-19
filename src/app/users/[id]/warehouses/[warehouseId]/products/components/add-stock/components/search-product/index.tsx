import { ChangeEvent, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import currency from "currency.js";


import styles from "./styles.module.css";

import useFech from "@/hooks/useFetch";
import { ProductInfoType } from "@/types/product";
import { TableHeadersType } from "@/components/table/types";

import { StockContext } from "@/context/StockContext";
import useSearchParams from "@/hooks/useSearchParams";
import { CartItem } from "@/types/cart";
import { getId } from "@/helpers/id";
import { isInvalidNumber } from "@/helpers/validation";

import Button from "@/components/shared/button";
import Collapse from "@/components/collapse";
import Table from "@/components/shared/table";
import Textfield from "@/components/Textfield";

const SearchProduct = () => {
    const { addItem, productsList } = useContext(StockContext)

    const [ cartItem, setCartItem ] = useState<CartItem<ProductInfoType> | null>(null)
    const [ value, settValue ] = useState("");

    const searchParams = useSearchParams()

    const onCloseRef = useRef<() => void>(null)
    const onOpenRef = useRef<() => void>(null)

    const headers = useRef<TableHeadersType[]>([
        {
            label: "Select",
            key: {
                value: "select_product"
            }
        },
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
            label: "Current stock",
            key: {
                value: "stock",
                subKey: {
                    value: "quantity"
                }
            }
        }
    ])

    const filteredProductsList = useMemo(() => {
        if(value.trim() && productsList) {
            const valueLowerCased = value.toLowerCase();

            return productsList.filter(product => {
                const nameIncludesValue = product.name.toLowerCase().includes(valueLowerCased);
                const barcodeIncludesValue = product.barcode?.toLowerCase()?.includes(valueLowerCased);

                return nameIncludesValue || barcodeIncludesValue;
            })
        }

        return []
    }, [ productsList, value ])

    const changeHandler = useCallback((key: string) => (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        if(key === "") {
            settValue(value);
            return;
        }

        setCartItem(currentItem => {
            const clonedItem = structuredClone(currentItem);

            clonedItem[key] = currency(value).value;

            if(isInvalidNumber(clonedItem[key])) {
                clonedItem[key] = 1;
            }

            clonedItem.product.purchasePrice = currency(clonedItem.total).divide(clonedItem.quantity).value

            return clonedItem;
        })
    }, []);
    //:;
    const rowOnChangeHandler = useCallback((product: ProductInfoType) => () => {
        setCartItem(item => {
            let clonedItem = structuredClone(item)
            
            //remove product if it's already in the list
            const productId = searchParams.get("product", "")
            if(productId && productId === product.id) {
                searchParams.removeSearchParam("product")

                return null;
            }

            searchParams.setSearchParam("product", product.id)
            //add product if it's not in the list
            return {
                id: getId(),
                product: structuredClone(product),
                quantity: 0,
                total: 0
            };
        })
    },[ searchParams ]);

    const clickHandler = useCallback(() => {
        let clonedItem = null;

        setCartItem(item => {
            clonedItem = structuredClone({ ...item });
            return null;
        })

        if(clonedItem) {
            addItem(clonedItem.product, clonedItem.quantity);
            settValue("");
            searchParams.removeSearchParam("product"); 
        }
    }, [ addItem, searchParams ])


    const { data, loading } = useFech<ProductInfoType[]>({
        autoFetch: true,
        url: `/api/stores/12345/products`
    })

    useEffect(() => {
        if(filteredProductsList.length > 0) onOpenRef.current?.();
        else onCloseRef.current?.();
    }, [ filteredProductsList ])

    return (
        <div className="mb-6 px-3">
            <div>
                <Textfield
                    className="w-full"
                    label="Insert product name ou bardcode"
                    onChange={changeHandler("")}
                    value={value}
                />
            </div>
            <Collapse 
                onClose={onCloseRef}
                onOpen={onOpenRef}>
                <div className="border border-solid border-primary-300 py-3 px-3">
                    <Table 
                        data={filteredProductsList}
                        headers={headers}
                        onChange={rowOnChangeHandler}
                    /> 
                    {
                        cartItem && (
                            <>
                                <div className="mb-8 pt-4 sm:flex justify-between">
                                    <Textfield 
                                        className={classNames(styles.input)}
                                        label="Insert quantity"
                                        onChange={changeHandler("quantity")}
                                        value={cartItem.quantity}
                                    />
                                    <Textfield 
                                        className={classNames(styles.input)}
                                        label="Insert total price"
                                        onChange={changeHandler("total")}
                                        value={cartItem.total}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button 
                                        className="px-4"
                                        onClick={clickHandler}>
                                        Add
                                    </Button>  
                                </div>
                            </>
                        )
                    }
                </div>
            </Collapse>
        </div>
    )
}

export default SearchProduct;