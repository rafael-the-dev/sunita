"use client"

import * as React from "react"

import { CartType  } from "@/types/cart"
import { ProductInfoType } from "@/types/product"
import currency from "currency.js";

import { calculaCartTotalPrice, calculateProductTotalPrice } from "@/helpers/cart";
import { PaymentMethodType, ProductPayment } from "@/types/payment-method";
import usePaymentMethods from "./hooks/usePaymentMethods"
import { getId } from "@/helpers/id";
import { isInvalidNumber } from "@/helpers/validation";

type SaleContextType = {
    addItem: (product: ProductInfoType, quantity: number) => void;
    changeQuantity: (productId: string, quantity: number) => void;
    getCart: () => CartType<ProductInfoType>;
    isEmpty: boolean;
    removeItem: (productId: string) => void;
    resetCart: () => void;

    // payment method
    addPaymentMethod: () => void;
    changePaymentMethodId: (id: number, newMethodId: number) => void;
    changePaymentMethodValue: (key: string, id: number | number, amount: number | string ) => void;
    getPaymentMethods: () => ProductPayment;
    removePaymentMethod: (id: string | number) => void;

}

export const SaleContext = React.createContext<SaleContextType | null>(null);
SaleContext.displayName = "SaleContext";

const initialState = {
    items: [],
    total:0
};

export const SaleContextProvider = ({ children, initial }: { children: React.ReactNode, initial?: CartType<ProductInfoType> }) => {
    const [ cart, setCart ] = React.useState<CartType<ProductInfoType>>(initialState)

    const getCart = React.useCallback(() => cart, [ cart ])

    const addItem = React.useCallback((product: ProductInfoType, quantity: number) => {
        setCart(cart => {
            const modifiedCart = structuredClone({ ...cart });
            
            const item = modifiedCart.items.find(cartItem => cartItem.product.id === product.id);

            if(item) {
                item.quantity = currency(item.quantity).add(quantity).value;

                if(isInvalidNumber(item.quantity)) {
                    item.quantity = 1;
                }

                item.total = calculateProductTotalPrice(item.product.sellPrice, item.quantity);
            } else {
                modifiedCart.items.push({
                    id: getId(),
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

                if(isInvalidNumber(item.quantity)) {
                    item.quantity = 1;
                }

                item.total = calculateProductTotalPrice(item.product.sellPrice, item.quantity);
            } 

            modifiedCart.total = calculaCartTotalPrice(modifiedCart);
            return modifiedCart;
        })
    }, [])

    const removeItem = React.useCallback((productId: string) => {
        setCart(cart => {
            const modifiedCart = structuredClone({ ...cart });
            
            modifiedCart.items = modifiedCart.items.filter(cartItem => cartItem.product.id !== productId);


            modifiedCart.total = calculaCartTotalPrice(modifiedCart);
            return modifiedCart;
        });
    }, []);

    const isEmpty = React.useMemo(() => getCart().items.length === 0, [ getCart ])

    const paymentMethods = usePaymentMethods(getCart());
    const resetPaymentMethods = paymentMethods.reset;

    const resetCart = React.useCallback(() => {
        setCart(initialState);
        resetPaymentMethods();
    }, [resetPaymentMethods ])
    
    return (
        <SaleContext.Provider
            value={{
                ...paymentMethods,
                isEmpty,

                addItem,
                changeQuantity,
                getCart,
                removeItem,
                resetCart
            }}>
            { children }
        </SaleContext.Provider>
    )
}