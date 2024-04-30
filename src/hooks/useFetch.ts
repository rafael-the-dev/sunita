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
    const [ state, setState ] = useState<StateType<T>>({ data: null, error: null, loading: autoFetch });

    const fetchData = useCallback(async ({ options, path, signal }: { options?: RequestInit, path?: string, signal?: AbortSignal }) => {
        setState((state) => ({
            ...state,
            loading: true
        }));
        
        try {
            const res = await fetch(path ?? url, options ?? { signal });
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
                error: err,
                data: null,
                loading: false
            });
        }
    }, [ url ]);

    useEffect(() => {
        const controller = new AbortController();

        if(autoFetch) fetchData({ signal: controller.signal});

        return () => {
            controller.abort;
        }
        
    }, [ fetchData, autoFetch ]);

    return { ...state, fetchData };
}

export default useFech