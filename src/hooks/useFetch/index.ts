"use client";

import { useCallback, useEffect, useState } from "react";

import { FetchDataPropsType } from "./types";

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

    const fetchData = useCallback(async ({ options, onError, onSuccess, path, signal }: FetchDataPropsType) => {
        setState((state) => ({
            ...state,
            loading: true
        }));
        
        try {
            const res = await fetch(path ?? url, options ?? { signal });
            const data = await res.json();

            if(res.status >= 200 && res.status < 300) {
                if(onSuccess) await onSuccess<T>(res, data);

                setState({
                    error: null,
                    data: data as T,
                    loading: false
                });
            }

            else throw new Error(data);
        } catch(err) {
            console.error(err);
            setState({
                error: err,
                data: null,
                loading: false
            });

            if(onError) onError(err)
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

export default useFech;