'use client';

import * as React from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";

import { ProductFilterType  } from "@/types/product"; 
import { Arapey } from "next/font/google";

type FiltersType = ProductFilterType & {
    isChecked: (origin: string | string[], value: string) => boolean;
    setSearchParams: (key: string, value: string) => void
};

export const ProductFilterContext = React.createContext<FiltersType | null>(null);

export const ProductFilterContextProvider = ({ children }: { children: React.ReactNode }) => {
    const params = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const isChecked = React.useCallback((origin: string | string[], value: string): boolean => origin.includes(value), [])

    const setSearchParams = React.useCallback((key: string, value: string) => {
        const searchParam = params.getAll(key);
        let searchParams = ``;

        if(searchParam.length > 0) {
            if(searchParam.includes(value))
                searchParams = searchParam
                    .filter(paramValue => paramValue !== value)
                    .map((paramValue => `${key}=${paramValue}&`))
                    .join("");
            else {
                searchParams = searchParam.map((paramValue => `${key}=${paramValue}&`)).join("");
                searchParams += `${key}=${value}`;
            }
        } else {
            searchParams = `${key}=${value}`;
        }

        router.push(`${pathname}?${searchParams}`);
    }, [ params, pathname, router])

    return (
        <ProductFilterContext.Provider
            value={{
                category: params.getAll("category"),
                price: {
                    min: 0,
                    max: 0
                },
                isChecked,
                setSearchParams
            }}>
            { children }
        </ProductFilterContext.Provider>
    )
};

