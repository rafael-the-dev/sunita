"use client";

import { useContext } from "react";

import { ProductInfoType } from "@/types/product";

import { LoginContext } from "@/context/LoginContext";

import useFetch from "./useFetch";


const useFechProducts = () => {
    const { credentials: { user } } = useContext(LoginContext)

    const { data, error, fetchData, loading } = useFetch<ProductInfoType[]>({
        url: `/api/users/${user.username}/warehouses/12345/products`
    })

    return { data, error, fetchProducts: fetchData, loading };
}

export default useFechProducts;