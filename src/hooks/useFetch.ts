"use client";

import { useCallback, useEffect, useState } from "react";

type StateType<T> = {
    data: T | null,
    error: Error | null,
    loading: boolean
};

type PropsType = {
    autoFetch?: boolean;
    url: string;
}

const useFech = <T>({ autoFetch= true, url }: PropsType) => {
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
    }, [ url ]);

    useEffect(() => {
        const controller = new AbortController();

        autoFetch && fetchData({ signal: controller.signal});

        return () => {
            controller.abort;
        }
        
    }, [ fetchData, autoFetch ]);

    return { ...state, fetchProducts: fetchData };
}

export default useFech