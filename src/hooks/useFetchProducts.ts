"use client";

import { useCallback, useEffect, useState } from "react";

import { ProductInfoType } from "@/types/product";

type StateType = {
    data: ProductInfoType[] | null,
    error: Error | null,
    loading: boolean
};

const useFechProducts = () => {
    const [ state, setState ] = useState<StateType>({ data: null, error: null, loading: true });

    const fetchData = useCallback(async ({ signal }: { signal: AbortSignal }) => {
        try {
            const res = await fetch("http://localhost:3000/api/users/rafaeltivane/warehouses/12345/products", { signal });
            const data = await res.json();

            if(res.status === 200) setState({
                error: null,
                data: data as ProductInfoType[],
                loading: false
            });

            else throw new Error(data);
        } catch(err) {
            console.error(err);
            setState({
                error: null,
                data: null,
                loading: false
            });
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        fetchData({ signal: controller.signal});

        return () => {
            controller.abort;
        }
        
    }, [ fetchData ]);

    return { ...state, fetchProducts: fetchData };
}

export default useFechProducts