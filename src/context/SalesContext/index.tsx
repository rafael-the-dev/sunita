"use client"

import * as React from "react";

import { ProductInfoType } from "@/types/product";

import useFechProducts from "@/hooks/useFetchProducts";

type SalesContextType = {
    getProducts: () => ProductInfoType[] | null
}

export const SalesContext = React.createContext<SalesContextType | null>(null);

export const SalesContextProvider = ({ children }: { children: React.ReactNode}) => {

    const { data } = useFechProducts()

    const getProducts = React.useCallback(() => data ?? [], [ data ])

    return (
        <SalesContext.Provider
            value={{
                getProducts
            }}>
            { children }
        </SalesContext.Provider>
    )
}