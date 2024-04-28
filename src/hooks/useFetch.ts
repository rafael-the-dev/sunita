"use client";

import { useCallback, useEffect, useState } from "react";

type StateType<T> = {
    data: T | null,
    error: Error | null,
    loading: boolean
};

const useFech = <T>({ url }) => {
    const [ state, setState ] = useState<StateType<T>>({ data: null, error: null, loading: true });

    const fetchData = useCallback(async ({ signal }: { signal: AbortSignal }) => {
        try {
            const res = await fetch(url, { signal });
            const data = await res.json();

            if(res.status === 200) setState({
                error: null,
                data: data as T,
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

export default useFech