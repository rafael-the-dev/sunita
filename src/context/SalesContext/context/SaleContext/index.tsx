"use client"

import * as React from "react"

import { CartType  } from "@/types/cart"
import { ProductInfoType } from "@/types/product"
import currency from "currency.js";
import { calculaCartTotalPrice, calculateProductTotalPrice } from "@/helpers/cart";

type SaleContextType = {
    addItem: (product: ProductInfoType, quantity: number) => void;
    changeQuantity: (productId: string, quantity: number) => void;
    getCart: () => CartType<ProductInfoType>;
    isEmpty: boolean;

}

export const SaleContext = React.createContext<SaleContextType | null>(null)
SaleContext.displayName = "SaleContext"

export const SaleContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [ cart, setCart ] = React.useState<CartType<ProductInfoType>>({
        items: [],
        total: 0
    })

    const getCart = React.useCallback(() => cart, [ cart ])

    const addItem = React.useCallback((product: ProductInfoType, quantity: number) => {
        setCart(cart => {
            const modifiedCart = structuredClone({ ...cart });
            
            const item = modifiedCart.items.find(cartItem => cartItem.product.id === product.id);

            if(item) {
                item.quantity = currency(item.quantity).add(quantity).value;
                item.total = calculateProductTotalPrice(item.product.sellPrice, item.quantity);
            } else {
                modifiedCart.items.push({
                    product,
                    quantity,
                    total: calculateProductTotalPrice(product.sellPrice, quantity)
                });
            }
            
            modifiedCart.total = calculaCartTotalPrice(modifiedCart);
            return modifiedCart;
        })
    }, [])

    const changeQuantity = React.useCallback((productId: string, quantity: number) => {
        setCart(cart => {
            const modifiedCart = structuredClone({ ...cart });
            
            const item = modifiedCart.items.find(cartItem => cartItem.product.id === productId);

            if(item) {
                item.quantity = currency(quantity).value;
                item.total = calculateProductTotalPrice(item.product.sellPrice, item.quantity);
            } 

            modifiedCart.total = calculaCartTotalPrice(modifiedCart);
            return modifiedCart;
        })
    }, [])

    const isEmpty = React.useMemo(() => getCart().items.length === 0, [ getCart ])
    
    return (
        <SaleContext.Provider
            value={{
                isEmpty,

                addItem,
                changeQuantity,
                getCart
            }}>
            { children }
        </SaleContext.Provider>
    )
}