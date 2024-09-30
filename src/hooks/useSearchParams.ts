'use client';

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const useSearchParamsHook = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const createQueryString = React.useCallback(
        (name: string, value: string) => {
          const params = new URLSearchParams(searchParams.toString())
          params.set(name, value)
     
          return params.toString();
        },
        [ searchParams ]
    )

    const get =  React.useCallback((key: string, defaultValue: any) => {
        const params = new URLSearchParams(searchParams.toString())
        const value = params.get(key)

        if(value) {
            try {
                return JSON.parse(value.replaceAll("--", " "));
            } catch(e) {
                return value ?? defaultValue;
            }
        }

        return defaultValue;
    }, [ searchParams ]);

    const set = React.useCallback(
        (key: string, value: string) => {
            router.push(`${pathname}?${createQueryString(key, value)}`);
        }, 
        [ createQueryString, pathname, router ]
    )
    
    const getAll = React.useCallback(
        (key: string) => {
            const params = new URLSearchParams(searchParams.toString())

            const list = params
                .getAll(key)
                .map(value => value.replaceAll("--", " "))

            return list
        }, 
        [ searchParams ]
    );

    const isChecked = React.useCallback((origin: string | string[], value: string): boolean => origin.includes(value), []);

    const removeSearchParam = React.useCallback((key: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete(key)

        router.push(`${pathname}?${params.toString()}`);
    }, [ pathname, router, searchParams ])

    const removeSearchParams = React.useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        params.delete(key, value)

        router.push(`${pathname}?${params.toString()}`);
    }, [ pathname, router, searchParams ])

    const getSearchParams = React.useCallback(
        (key: string, isUnique: boolean = false) => getAll(key), [ getAll ]);

    const setSearchParams = React.useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())

            params.append(key, value)

            router.push(`${pathname}?${params.toString()}`);
        }, 
        [ pathname, searchParams, router ]
    );

    const setSearchParam = React.useCallback(
        (key: string, value: string) => set(key, value), 
        [ set ]
    );

    const toggleSearchParam = React.useCallback(
        (key: string, value: string) =>  {
            if(searchParams.get(key)) removeSearchParam(key)
            else setSearchParam(key, value)
        }, 
        [ removeSearchParam, setSearchParam, searchParams ]
    );

    const toggleSearchParams = React.useCallback(
        (key: string, value: string) =>  {
            const isIncluded = new URLSearchParams(searchParams.toString()).has(key, value)

            if(isIncluded) removeSearchParams(key, value)
            else setSearchParams(key, value)
        }, 
        [ removeSearchParams, setSearchParams, searchParams ]
    );

    const changeHandler = React.useCallback(
        (key: string, func: (key: string, value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => func(key, e.target.value),
        []
    )

    return {
        changeHandler,
        get, getAll,
        isChecked,
        removeSearchParam,
        setSearchParam, setSearchParams,
        toggleSearchParam, toggleSearchParams
    }
};

export default useSearchParamsHook;

