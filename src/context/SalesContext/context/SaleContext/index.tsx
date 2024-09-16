"use client"

import * as React from "react"
import currency from "currency.js";

import { SalesContext } from "../..";

import { ProductInfoType } from "@/types/product";
import { ProductPayment } from "@/types/payment-method";
import { CartType  } from "@/types/cart";
import { PaymentFunctionsType } from "@/hooks/usePayment/types"

import usePaymentMethods from "./hooks/usePaymentMethods";
import { useLocalStorage } from "./hooks/useLocalStorage";

import { calculaCartTotalPrice, calculateProductTotalPrice } from "@/helpers/cart";
import { getId } from "@/helpers/id";
import { isInvalidNumber } from "@/helpers/validation";

type SaleContextType = PaymentFunctionsType & {
    addItem: (product: ProductInfoType, quantity: number) => void;
    changeQuantity: (productId: string, quantity: number) => void;
    getCart: () => CartType<ProductInfoType>;
    hasQuantityErrors: boolean;
    isEmpty: boolean;
    removeItem: (productId: string) => void;
    resetCart: () => void;

    // payment method
    getPaymentMethods: () => ProductPayment;
    /*addPaymentMethod: () => void;
    changePaymentMethodId: (id: number, newMethodId: number) => void;
    changePaymentMethodValue: (key: string, id: number | number, amount: number | string ) => void;
    removePaymentMethod: (id: string | number) => void;*/

}

export const SaleContext = React.createContext<SaleContextType | null>(null);
SaleContext.displayName = "SaleContext";

const initialState = {
    id: getId(),
    items: [],
    total:0
};

export const SaleContextProvider = ({ children, initial }: { children: React.ReactNode, initial?: CartType<ProductInfoType> }) => {
    const { getProducts } = React.useContext(SalesContext);

    const [ cart, setCart ] = React.useState<CartType<ProductInfoType>>(initial ?? initialState);

    const getCart = React.useCallback(() => cart, [ cart ]);

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
    }, []);

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
    }, []);

    const removeItem = React.useCallback((productId: string) => {
        setCart(cart => {
            const modifiedCart = structuredClone({ ...cart });
            
            modifiedCart.items = modifiedCart.items.filter(cartItem => cartItem.product.id !== productId);

            modifiedCart.total = calculaCartTotalPrice(modifiedCart);
            return modifiedCart;
        });
    }, []);

    //iterate through cart's items to find item with quantity greater than available stock
    const hasQuantityErrors = React.useMemo(() => {
        return Boolean(getCart().items.find(item => item.quantity > item.product.stock.quantity));
    }, [ getCart ])

    const isEmpty = React.useMemo(() => getCart().items.length === 0, [ getCart ]);

    const paymentMethods = usePaymentMethods(getCart());
    useLocalStorage(cart);

    const resetPaymentMethods = paymentMethods.reset;

    const resetCart = React.useCallback(() => {
        setCart(currentCart => ({ ...initialState, id: currentCart.id }));
        resetPaymentMethods();
    }, [resetPaymentMethods ])

    //update cart products when getProducts methods changes
    React.useEffect(() => {
        const products = getProducts()

        setCart(cart => {
            const cartClone = structuredClone(cart);
            
            cartClone.items = cartClone.items.map((item => {
                const product = products.find(product => product.id === item.product.id)

                if(!product) return item;

                //if product was found, return its updated version from products list
                return {
                    ...item,
                    product
                }
            }))

            return cartClone;
        })
    }, [ getProducts ])
    
    return (
        <SaleContext.Provider
            value={{
                ...paymentMethods,
                hasQuantityErrors,
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