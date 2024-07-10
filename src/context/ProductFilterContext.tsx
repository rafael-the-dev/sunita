'use client';

import * as React from "react";
import currency from "currency.js"

import { ProductFilterType  } from "@/types/product"; 

import useSearchParams from "@/hooks/useSearchParams"

type FiltersType = ProductFilterType & {
    isChecked: (origin: string | string[], value: string) => boolean;
    setManySearchParams: (key: string, value: string) => void;
    setUniqueSearchParams: (key: string, value: string) => void
};

export const ProductFilterContext = React.createContext<FiltersType | null>(null);

export const ProductFilterContextProvider = ({ children }: { children: React.ReactNode }) => {
    const params = useSearchParams();

    const get =  React.useCallback((key: string, defaultValue: any) => {
        const  value = params.get(key, defaultValue);
        
        return value;
    }, [ params ]);
    
    const getAll = React.useCallback((key: string) => params.getAll(key), [ params ]);

    const isChecked = React.useCallback((origin: string | string[], value: string): boolean => origin.includes(value), []);

    const setManySearchParams = React.useCallback(
        (key: string, value: string) => params.setSearchParams(key, value), 
        [ params ]
    );

    const setUniqueSearchParams = React.useCallback(
        (key: string, value: string) => params.setSearchParam(key, value), 
        [ params ]
    );

    return (
        <ProductFilterContext.Provider
            value={{
                category: params.getAll("category"),
                price: {
                    min: currency(get("min-price", 0)).value,
                    max: currency(get("max-price", 0)).value
                },
                isChecked,
                searchKey: get("search-key", ""),

                // METHODS
                setManySearchParams,
                setUniqueSearchParams
            }}>
            { children }
        </ProductFilterContext.Provider>
    )
};

