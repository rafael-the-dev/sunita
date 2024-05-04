import { ChangeEvent, useCallback, useContext, useRef } from "react";
import classNames from "classnames";

import styles from "./styles.module.css";
import { CartItem } from "@/types/cart";
import { ProductInfoType } from "@/types/product";

import { AppContext } from "@/context/AppContext";
import { StockContext } from "@/context/StockContext";
import { TableHeadersType } from "@/components/table/types";

import Button from "@/components/shared/button"
import QuantityInput from "@/components/shared/quantity-input"
import SearchProduct from "./components/search-product";
import Table from "@/components/shared/table";
import useFech from "@/hooks/useFetch";
import { SetterFuncType } from "@/context/StockContext/types";

const AddStock = ({ refreshProducts }: { refreshProducts: ({ signal }: { signal: AbortSignal }) => Promise<void> }) => {
    const { setDialog } = useContext(AppContext)

    const changeHandler = useCallback((product: ProductInfoType, func: SetterFuncType) => (e: ChangeEvent<HTMLInputElement>) => {
        func(product, e.target.value, "CHANGE");
    }, [])

    const { 
        getCart, 
        removeItem, 
        setQuantity, setSellPrice, setTotal,
        toString 
    } = useContext(StockContext)

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
            label: "Current stock",
            key: {
                value: "product",
                subKey: {
                    value: "stock",
                    subKey: {
                        value: "quantity"
                    }
                }
            }
        },
        {
            label: "Quantity",
            getComponent: ({ item }) => {
                const cartItem = item as CartItem<ProductInfoType>;
                return (
                    <QuantityInput 
                        hasError={false}
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
                        hasError={false}
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
                        hasError={false}
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

    const cancelHandler = useCallback(() => setDialog(null), [ setDialog ]);
    const removeHandler = useCallback((row: CartItem<ProductInfoType>) => () => removeItem(row.product.id), [ removeItem ]);

    const { fetchData, loading } = useFech({
        autoFetch: false,
        url: `/api/users/rafaeltivane/warehouses/12345/products/stock-reports`
    });

    const submitHandler = () => {
        fetchData({
            options: {
                body: toString(),
                method: "POST"
            },
            async onSuccess(res, data) {
                await refreshProducts({ signal: null })
            },
        })
    };

    return (
        <form className={classNames(styles.form, `pt-6 pb-12 relative`)}>
            <SearchProduct />
            {
                getCart().items.length > 0 && (
                    <div className="px-3">
                        <Table 
                            data={getCart().items}
                            headers={headers}
                            onRemoveRow={removeHandler}
                        />
                        <div className="flex flex-col mt-8 sm:flex-row sm:justify-end">
                            <Button 
                                className="mb-3 sm:mb-0 sm:mr-3" 
                                onClick={cancelHandler}
                                variant="outlined">
                                Cancel
                            </Button>
                            <Button 
                                className=""
                                onClick={submitHandler}>
                                { loading ? "Loading..." : "Submit" }
                            </Button>
                        </div>
                    </div>
                )
            }
        </form>
    );
};

export default AddStock;