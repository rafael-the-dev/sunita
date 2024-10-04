"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { FetchDataPropsType } from "./types";

import { getItem } from "@/helpers/local-storage"
import { CredentialsType } from "@/types/login";

type StateType<T> = {
    data: T | null,
    error: Error | null,
    loading: boolean
};

type PropsType = {
    autoFetch?: boolean;
    url: string;
}

const useFetch = <T>({ autoFetch= true, url }: PropsType) => {
    const [ state, setState ] = useState<StateType<T>>({ data: null, error: null, loading: autoFetch });

    const isfirstRender = useRef(true)

    const fetchData = useCallback(async ({ options, onError, onSuccess, path, signal }: FetchDataPropsType) => {
        isfirstRender.current = false

        setState((state) => ({
            ...state,
            loading: true
        }));

        const innerOptions = options ?? { signal };
        
        if(!options?.headers) {
            const { access: { token }} = getItem<CredentialsType>("credentials")
            innerOptions.headers = {
                authorization: `bearer ${token}`
            }
        }

        try {
            const res = await fetch(path ?? url, innerOptions);
            const data = await res.json();

            if(res.status === 401) {
                window.location.pathname = "/login"
            }

            if(res.status >= 200 && res.status < 300) {
                if(onSuccess) onSuccess<T>(res, data);

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
        if(!isfirstRender.current) {
            isfirstRender.current = false;
            return;
        }
        
        const controller = new AbortController();

        if(autoFetch) fetchData({ signal: controller.signal});

        return () => {
            controller.abort;
        }
        
    }, [ fetchData, autoFetch ]);

    return { ...state, fetchData };
}

export default useFetch;