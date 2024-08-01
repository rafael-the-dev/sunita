"use client";

import * as React from "react";
import classNames from "classnames";

//import styles from "../../styles.module.css";

import { TableHeadersType } from "@/components/table/types";

import { ProductInfoType } from "@/types/product";
import { AppContext } from "@/context/AppContext";
import { LoginContext } from "@/context/LoginContext";
import { StockContextProvider } from "@/context/StockContext";
import { ProductFilterContext } from "@/context/ProductFilterContext";
import { ProductsPageContext } from "../../context"

import useSearchParams from "@/hooks/useSearchParams";

import AddStock from "../../components/add-stock";
import Button from "@/components/shared/button"
import Categories from "@/app/users/[id]/warehouses/[warehouseId]/expenses/components/TabBody/components/categories"
import DialogBody from "../../components/register-product/components/body";
import RegisterProduct from "../../components/register-product";
import SearchBox from "@/components/shared/product-search-box";
import Table from "@/components/shared/table";

enum DIALOG_TYPES {
    ADD_STOCK = "add-stock",
    CATEGORIES = "category",
    REGIST_PRODUCT = "regist-product"
}

const ProductsView = () => {
    const { credentials } = React.useContext(LoginContext)
    const { products } = React.useContext(ProductsPageContext)

    const searchParams = useSearchParams()

    const { setDialog } = React.useContext(AppContext);
    const { category, price, searchKey, setUniqueSearchParams } = React.useContext(ProductFilterContext);

    const reRendersCounter = React.useRef(0)

    const { data, fetchProducts } = products;

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

    const openAddStockDialog = React.useCallback(() => {
        setDialog({
            header: {
                title: "Add stock"
            },
            body: <StockContextProvider productsList={productsList}><AddStock refreshProducts={fetchProducts} /></StockContextProvider>
        })
    }, [ fetchProducts, productsList, setDialog ])

    const openCategoriesDialog = React.useCallback(() => {
        setDialog({
            header: {
                title: "Categories"
            },
            body: <Categories url={`/api/stores/${credentials?.user?.stores[0]?.storeId}/products/categories`} />
        })
    }, [ credentials, setDialog ])

    const openRegisterProductDialog = React.useCallback(
        () => {
            setDialog({
                header: { title: "Register product" },
                body: <RegisterProduct />
            })
        },
        [ setDialog ]
    )

    const openDialogHandler = React.useCallback((id: DIALOG_TYPES) => () => {
        reRendersCounter.current = 0;
        searchParams.setSearchParam("dialog", id)
    }, [ searchParams ])

    const dialogQueryString = searchParams.get("dialog", "")

    React.useEffect(() => {
        if(dialogQueryString === DIALOG_TYPES.ADD_STOCK) openAddStockDialog();
        else if(dialogQueryString === DIALOG_TYPES.CATEGORIES) openCategoriesDialog();
        else if(dialogQueryString === DIALOG_TYPES.REGIST_PRODUCT) openRegisterProductDialog()
    }, [ dialogQueryString, openAddStockDialog, openCategoriesDialog, openRegisterProductDialog ])

    return (
        <div className="flex flex-col h-full items-stretch justify-between">
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
                <div className={classNames( `mt-6 table-body`)}>
                    { productsList.length > 0 && <Table 
                        data={productsListFiltered}
                        headers={headers}
                        onClickRow={rowClickHandler}
                    /> }
                </div>
            </div>
            <div className="flex flex-col items-stretch justify-end px-3 sm:flex-row">
                <Button 
                    className="mb-3 sm:mb-0 sm:mr-3" 
                    onClick={openDialogHandler(DIALOG_TYPES.CATEGORIES)}
                    variant="outlined">
                    Categories
                </Button>
                <Button 
                    className=""
                    onClick={openDialogHandler(DIALOG_TYPES.REGIST_PRODUCT)}>
                    Register
                </Button>
            </div>
        </div>
    );
};

export default ProductsView;