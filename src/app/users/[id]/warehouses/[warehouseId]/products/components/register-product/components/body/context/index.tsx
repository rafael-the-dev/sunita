import { ChangeEvent, createContext, useCallback, useState } from "react";

import { ContextType, PropsType } from "./types";

import { PRODUCTS_CATEGORIES } from "@/types/product";

import { useCar } from "./hooks/useCar";
import { useExpirableProduct } from "./hooks/useExpirableProduct"
import { useFurniture } from "./hooks/useFurniture"
import { useProduct } from "./hooks"

export const ProductFormContext = createContext<ContextType>({} as ContextType)

export const ProductFormContextProvider = ({ children }: PropsType) => {
    const { car, ...carMethods } = useCar()
    const { expirableProduct, ...expirableProductMethods } = useExpirableProduct()
    const { furnicture, ...furnictureMethods } = useFurniture()
    const { product, ...productMethods } = useProduct()

    return (
        <ProductFormContext.Provider
            value={{
                ...carMethods,
                ...expirableProductMethods,
                ...furnictureMethods,
                ...productMethods,
                input: {
                    ...product,
                    car,
                    expirable: expirableProduct,
                    furnicture,

                },
            }}>
            { children }
        </ProductFormContext.Provider>
    )
}