"use client";

import * as React from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

import { ProductInfoType } from "@/types/product";
import { AppContext } from "@/context/AppContext";
import { LoginContext } from "@/context/LoginContext";
import { StockContextProvider } from "@/context/StockContext";
import { ProductFilterContext, ProductFilterContextProvider  } from "@/context/ProductFilterContext";
import { ProductsPageContextProvider } from "./context"

import useSearchParams from "@/hooks/useSearchParams";

import ProductsView from "./views/Product"
import SuppliersView from "./views/Suppliers"

import { FixedTabsContext as StaticTabsContext } from "@/context/FixedTabsContext"
import { Provider as FixedTabsContextProvider } from "@/components/shared/FixedTabsContainer"

enum TABS {
    PRODUCTS = "products",
    REPORT = "report",
    SUPPLIERS = "suppliers"
}

const tabs = [
    {
        id: TABS.PRODUCTS,
        name: "Products"
    },
    {
        id: TABS.REPORT,
        name: "Report"
    },
    {
        id: TABS.SUPPLIERS,
        name: "Suppliers"
    },
    
]

const Container = () => {
    const { getActiveTab } = React.useContext(StaticTabsContext)

    const activeTab = getActiveTab().id

    return (
        <div className={classNames("scrollable overflow-x-auto pt-6 px-2 md:px-4")}>
            {
                {
                    [TABS.PRODUCTS]: <ProductsView />,
                    [TABS.REPORT]: <div></div>,
                    [TABS.SUPPLIERS]: <SuppliersView />
                }[activeTab]
            }
        </div>
    );
};

const ProductsPage = () => {

    return (
        <ProductsPageContextProvider>
        <FixedTabsContextProvider
            tabs={tabs}>
            <ProductFilterContextProvider>
                
                    <Container />
            </ProductFilterContextProvider>
        </FixedTabsContextProvider></ProductsPageContextProvider>
    )
}

export default ProductsPage;