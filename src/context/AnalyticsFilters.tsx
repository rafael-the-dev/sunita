import useFech from "@/hooks/useFetch";
import { ProductInfoType } from "@/types/product";
import * as React from "react";


type AnalyticsFiltersType = {
    getCategories: () => any[];
    getProducts: () => ProductInfoType[];
    onToggleCollapse: React.MutableRefObject<() => void>;
}

export const AnalyticsFiltersContext = React.createContext<AnalyticsFiltersType>(null);
AnalyticsFiltersContext.displayName = "AnalyticsFiltersContext";

type PropsType = {
    autoFetchProducts?: boolean;
    children: React.ReactNode;
}

export const AnalyticsFiltersContextProvider = ({ autoFetchProducts= true,children }: PropsType) => {

    const onToggleCollapse = React.useRef<() => void | null>(null)

    const fetchProductsResult = useFech<ProductInfoType[]>({ 
            autoFetch: autoFetchProducts, 
            url: "/api/users/rafaeltivane/warehouses/12345/products" 
        }
    );

    const getCategories = React.useCallback(() => [], [])
    const getProducts = React.useCallback(() => fetchProductsResult.data, [ fetchProductsResult ]);

    return (
        <AnalyticsFiltersContext.Provider
            value={{
                getCategories,
                getProducts,
                onToggleCollapse
            }}>
            { children }
        </AnalyticsFiltersContext.Provider>
    )
};