"use client";

import * as React from "react";
import classNames from "classnames";

import { AppContext } from "@/context/AppContext";
import { LoginContext } from "@/context/LoginContext";
import { ProductFilterContext } from "@/context/ProductFilterContext";
import { StockContextProvider } from "@/context/StockContext";

import useSearchParams from "@/hooks/useSearchParams";

import AddStock from "../../components/add-stock";
import Button from "@/components/shared/button"
import Categories from "@/app/users/[id]/warehouses/[warehouseId]/expenses/components/TabBody/components/categories"
import RegisterProduct from "../../components/register-product";
import SearchBox from "@/components/shared/product-search-box";
import Table from "./components/Table";

enum DIALOG_TYPES {
    ADD_STOCK = "add-stock",
    CATEGORIES = "category",
    REGIST_PRODUCT = "regist-product"
}

const ProductsView = () => {
    const { credentials } = React.useContext(LoginContext)

    const searchParams = useSearchParams()

    const { setDialog } = React.useContext(AppContext);
    const { setUniqueSearchParams } = React.useContext(ProductFilterContext);

    const reRendersCounter = React.useRef(0)

    const changeHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setUniqueSearchParams("search-key", e.target.value), 
        [ setUniqueSearchParams ]
    );

    const openAddStockDialog = React.useCallback(
        () => {
            setDialog({
                header: {
                    title: "Add stock"
                },
                body: (
                    <StockContextProvider>
                        <AddStock />
                    </StockContextProvider>
                )
            })
        }, 
        [ setDialog ]
    )

    const openCategoriesDialog = React.useCallback(
        () => {
            setDialog({
                header: {
                    title: "Categories"
                },
                body: <Categories url={`/api/stores/${credentials?.user?.stores[0]?.storeId}/products/categories`} />
            })
        }, 
        [ credentials, setDialog ]
    )

    const openRegisterProductDialog = React.useCallback(
        () => {
            setDialog({
                header: { title: "Register product" },
                body: <RegisterProduct />
            })
        },
        [ setDialog ]
    )

    const openDialogHandler = React.useCallback(
        (id: DIALOG_TYPES) => () => {
            reRendersCounter.current = 0;
            searchParams.setSearchParam("dialog", id)
        }, [ searchParams ]
    )

    const dialogQueryString = searchParams.get("dialog", "")

    React.useEffect(
        () => {
            if(dialogQueryString === DIALOG_TYPES.ADD_STOCK) openAddStockDialog();
            else if(dialogQueryString === DIALOG_TYPES.CATEGORIES) openCategoriesDialog();
            else if(dialogQueryString === DIALOG_TYPES.REGIST_PRODUCT) openRegisterProductDialog()
        }, 
        [ dialogQueryString, openAddStockDialog, openCategoriesDialog, openRegisterProductDialog ]
    )

    return (
        <div className="flex flex-col h-full items-stretch justify-between">
            <div className="">
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
                    <Table />
                </div>
            </div>
            <div className="flex flex-col items-stretch justify-end sm:flex-row">
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