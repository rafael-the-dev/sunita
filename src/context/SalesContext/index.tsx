"use client"

import * as React from "react";

import { CustomerInfoType } from "@/types/guest";
import { ProductInfoType } from "@/types/product";

import { LoginContext } from "../LoginContext";

import useFechProducts from "@/hooks/useFetchProducts";
import useFetch from "@/hooks/useFetch";

type SalesContextType = {
    fetchProducts: ({ signal }: { signal?: AbortSignal }) => Promise<void>;
    getClients: () => CustomerInfoType[],
    getProducts: () => ProductInfoType[] | null
}

export const SalesContext = React.createContext<SalesContextType | null>(null);

export const SalesContextProvider = ({ children }: { children: React.ReactNode}) => {
    const { credentials } = React.useContext(LoginContext)

    const { data, fetchProducts } = useFechProducts()

    const clientsResponse = useFetch<{ list: CustomerInfoType[]}>(
        {
            autoFetch: false,
            url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/clients`
        }
    )

    const fetchClients = clientsResponse.fetchData
    const clientsList = clientsResponse?.data?.list

    const getClients = React.useCallback(() => clientsList ?? [], [ clientsList ])
    const getProducts = React.useCallback(() => data ?? [], [ data ])


    React.useEffect(
        () => {
            const controller = new AbortController()

            const timeout = setTimeout(
                () => 
                    fetchClients(
                        {
                            signal: controller.signal
                        }
                    ),
                9000
            )

            return () => {
                controller.abort()
                clearTimeout(timeout)
            }
        }, 
        [ fetchClients ]
    )

    return (
        <SalesContext.Provider
            value={{
                fetchProducts,
                getClients,
                getProducts
            }}>
            { children }
        </SalesContext.Provider>
    )
}