import { createContext, useCallback, useContext, useState } from "react";
import currency from "currency.js";

import { AppContext } from "@/context/AppContext"
import { ContextType, PropsType, ProductInputsType } from "./types";
import { ProductInfoType, StoreProductType } from "@/types/product";


import useCar from "./hooks/useCar";
import useExpirableProduct from "./hooks/useExpirableProduct"
import useFurniture from "./hooks/useFurniture"
import useProduct  from "./hooks"
import { defaultInput, getDefaultProductValues } from "./values";

export const ProductFormContext = createContext<ContextType>({} as ContextType)

export const ProductFormContextProvider = ({ children }: PropsType) => {
    const { dialog } = useContext(AppContext);

    const hasPayload = Boolean(dialog?.payload);

    const [ input, setInput ] = useState(() => {
        if(!hasPayload) return structuredClone(defaultInput);

        const productPayload = dialog.payload as ProductInfoType;
        
        const product: ProductInputsType = getDefaultProductValues(productPayload);

        return product;
    });

    const carMethods = useCar(input, setInput);
    const expirableProductMethods = useExpirableProduct(input, setInput);
    const furnictureMethods = useFurniture(input, setInput);
    const productMethods = useProduct(input, setInput);

    const hasErrors = () => {
        return [
            carMethods.hasErrors(),
            expirableProductMethods.hasErrors(),
            furnictureMethods.hasErrors(),
            productMethods.hasErrors()
        ].find(error => error)
    };

    const reset = useCallback(
        () => setInput(input => {
            const inputClone = structuredClone(defaultInput)

            inputClone.category.value = input.category.value;

            return inputClone;
        }),
        []
    ); 

    const toString = () => {
        const product: StoreProductType = {
            car: carMethods.toString(),
            createdAt: null,
            category: input.category.value,
            expirable: expirableProductMethods.toString(),
            id: null,
            name: input.name.value,
            profit: null,
            purchasePrice: currency(input.price.purchase.value).value,
            sellPrice: currency(input.price.sell.value).value,
            status: null,
            stock: null,
            stores: null,
            username: null
        };

        return JSON.stringify(product)
    };

    return (
        <ProductFormContext.Provider
            value={{
                ...carMethods,
                ...expirableProductMethods,
                ...furnictureMethods,
                ...productMethods,
                hasPayload,
                input,
                hasErrors,
                reset,
                toString
            }}>
            { children }
        </ProductFormContext.Provider>
    )
}