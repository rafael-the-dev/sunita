import useFech from "@/hooks/useFetch";
import { ProductInfoType } from "@/types/product";
import { UserType } from "@/types/user";
import * as React from "react";


type AnalyticsFiltersType = {
    getCategories: () => any[];
    getData: <T extends Object>(key: string) => T;
    onToggleCollapse: React.MutableRefObject<() => void>;
    setData: <T extends Object>(key: string, data: T) => void;
}

export const AnalyticsFiltersContext = React.createContext<AnalyticsFiltersType>(null);
AnalyticsFiltersContext.displayName = "AnalyticsFiltersContext";

type PropsType = {
    autoFetchProducts?: boolean;
    children: React.ReactNode;
}

type PropertiesType = {
    products: ProductInfoType[];
    users: UserType[];
}

export const AnalyticsFiltersContextProvider = ({ autoFetchProducts= true,children }: PropsType) => {
    const properties = React.useRef<PropertiesType>({
        products: [],
        users: []
    });

    const onToggleCollapse = React.useRef<() => void | null>(null)

    const getCategories = React.useCallback(() => [], [])

    const getData = React.useCallback(<T extends Object>(key: string): T => properties.current[key], []);
    const setData = React.useCallback(<T extends Object>(key: string, data: T) => { properties.current[key] = data }, []);

    return (
        <AnalyticsFiltersContext.Provider
            value={{
                getCategories, getData,
                onToggleCollapse,
                setData,
            }}>
            { children }
        </AnalyticsFiltersContext.Provider>
    )
};