import { createContext, useCallback, useState } from "react";

import { ContextType, PropsType } from "./types";

import useCar from "./hooks/useCar";
import useExpirableProduct from "./hooks/useExpirableProduct"
import useFurniture from "./hooks/useFurniture"
import useProduct  from "./hooks"
import { defaultInput } from "./values";

export const ProductFormContext = createContext<ContextType>({} as ContextType)


export const ProductFormContextProvider = ({ children }: PropsType) => {
    const [ input, setInput ] = useState(defaultInput)

    const carMethods = useCar(setInput)
    const expirableProductMethods = useExpirableProduct(setInput)
    const furnictureMethods = useFurniture(setInput)
    const productMethods = useProduct(setInput)

    const reset = useCallback(
        () => setInput({ ...defaultInput }),
        []
    ) 

    return (
        <ProductFormContext.Provider
            value={{
                ...carMethods,
                ...expirableProductMethods,
                ...furnictureMethods,
                ...productMethods,
                input,
                reset
            }}>
            { children }
        </ProductFormContext.Provider>
    )
}