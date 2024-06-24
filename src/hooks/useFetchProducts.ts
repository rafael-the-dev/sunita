"use client";

import { useContext } from "react";

import { ProductInfoType } from "@/types/product";

import { LoginContext } from "@/context/LoginContext";

import useFetch from "./useFetch";


const useFechProducts = () => {
    const { credentials } = useContext(LoginContext)

    const { data, error, fetchData, loading } = useFetch<ProductInfoType[]>({
        url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/products`
    })

    return { data, error, fetchProducts: fetchData, loading };
}

export default useFechProducts;