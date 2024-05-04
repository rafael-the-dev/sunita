'use client';

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const useSearchParamsHook = () => {
    const params = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const get =  React.useCallback((key: string, defaultValue: any) => {
        const value = params.get(key);

        if(value) {
            try {
                return JSON.parse(value.replaceAll("--", " "));
            } catch(e) {
                return value;
            }
        }

        return defaultValue;
    }, [ params ]);
    
    const getAll = React.useCallback((key: string) => params.getAll(key).map(value => value.replaceAll("--", " ")), [ params ]);

    const isChecked = React.useCallback((origin: string | string[], value: string): boolean => origin.includes(value), []);

    const removeSearchParam = React.useCallback((key: string) => {
        let searchParams = "";

        params.forEach((value, currentKey) => {
            if(currentKey === key) searchParams += ``;
            else searchParams += `${currentKey}=${value}&`;
        });

        router.push(`${pathname}?${searchParams}`);
    }, [ params, pathname, router ])

    const getSearchParams = React.useCallback((key: string, isUnique: boolean = false) => {
        let searchParams = "";

        params.forEach((value, currentKey) => {
            if(isUnique) {
                if(currentKey === key) searchParams += ``;
                else searchParams += `${currentKey}=${value}&`;
            } else {
                searchParams += `${currentKey}=${value}&`
            }
        });

        return searchParams;
    }, [ params ]);

    const setSearchParams = React.useCallback((key: string, value: string) => {
        const searchParam = params.getAll(key);
        let currentSearchParams = "";
        let searchParams = ``;

        if(searchParam.length > 0) {
            // get current search params different of selected key
            params.forEach((value, currentKey) => {
                if(currentKey !== key) searchParams += `${currentKey}=${value}&`
            });

            if(searchParam.includes(value)) {
                // remove current search param from search params list
                searchParams += searchParam
                    .filter(paramValue => paramValue !== value)
                    .map((paramValue => `${key}=${paramValue}&`))
                    .join("");
            } else {
                // add current value to search params' key
                searchParams += searchParam.map((paramValue => `${key}=${paramValue}&`)).join("");
                searchParams += `${key}=${value}`;
            }
        } else {
            currentSearchParams = getSearchParams(key);
            searchParams = `${currentSearchParams}${key}=${value}`;
        }

        router.push(`${pathname}?${searchParams}`);
    }, [ getSearchParams, params, pathname, router]);

    const setSearchParam = React.useCallback((key: string, value: string) => {
        let searchParams = `${getSearchParams(key, true)}${key}=${value.replaceAll(" ", "--")}`;

        router.push(`${pathname}?${searchParams}`);

    }, [ getSearchParams, pathname, router ]);

    return {
        get, getAll,
        isChecked,
        removeSearchParam,
        setSearchParam, setSearchParams
    }
};

export default useSearchParamsHook;

