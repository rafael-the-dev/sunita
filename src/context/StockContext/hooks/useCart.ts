import * as React from "react";
import currency from "currency.js"

import { CartItem, CartType } from "@/types/cart";
import { ProductInfoType } from "@/types/product";
import { SetterFuncType, StockContextType, StockReportInputProps } from "../types";
import { calculaCartTotalPrice, calculateProductTotalPrice } from "@/helpers/cart";
import { getId } from "@/helpers/id";

export const StockContext = React.createContext<StockContextType | null>(null);
StockContext.displayName = "StockContext";

const initialState = {
    items: [],
    total:0
};

const useCart = () => {
    const [ cart, setCart ] = React.useState<CartType<ProductInfoType>>(initialState);

    const getCart = React.useCallback(() => structuredClone(cart), [ cart ]);

    const addItem = React.useCallback((product: ProductInfoType, quantity: number) => {
        setCart(cart => {
            const modifiedCart = structuredClone({ ...cart });
            
            const item = modifiedCart.items.find(cartItem => cartItem.product.id === product.id);

            if(item) {
                item.quantity = currency(item.quantity).add(quantity).value;
                item.total = calculateProductTotalPrice(item.product.purchasePrice, item.quantity);
            } else {
                modifiedCart.items.push({
                    id: getId(),
                    product,
                    quantity,
                    total: calculateProductTotalPrice(product.purchasePrice, quantity)
                });
            }
            
            modifiedCart.total = calculaCartTotalPrice(modifiedCart);
            return modifiedCart;
        })
    }, [])

    const setHelper = React.useCallback(( product: ProductInfoType, quantity: number | string, modifierFunc: (item: CartItem<ProductInfoType>) => void) => {
        setCart(cart => {
            const modifiedCart = structuredClone({ ...cart });
            
            const item = modifiedCart.items.find(cartItem => cartItem.product.id === product.id);

            if(!item) {
                throw new Error("Item not found")
            }

            modifierFunc(item);
            item.product.profit = currency(item.product.sellPrice).subtract(item.product.purchasePrice).value
            
            modifiedCart.total = calculaCartTotalPrice(modifiedCart);
            return modifiedCart;
        })
    }, []); //:;
    
    const setQuantity: SetterFuncType = React.useCallback(( product, value, type) => {
        setHelper(
            product, 
            value, 
            item => { 
                if(type === "CHANGE") item.quantity = currency(value).value;
                else item.quantity = currency(item.quantity).add(value).value;

                item.total = calculateProductTotalPrice(item.product.purchasePrice, item.quantity);
            }
        )
    }, [ setHelper ]);

    const setSellPrice: SetterFuncType = React.useCallback(( product, value, type) => {
        setHelper(
            product, 
            value, 
            item => { 
                if(type === "CHANGE") item.product.sellPrice = currency(value).value;
                else item.product.sellPrice = currency(item.product.sellPrice).add(value).value; 
            }
        )
    }, [ setHelper ]);

    const setTotal: SetterFuncType = React.useCallback(( product, value, type ) => {
        setHelper(
            product, 
            value, 
            item => { 
                if(type === "CHANGE") item.total = currency(value).value;
                else item.total = currency(item.total).add(value).value; 

                item.product.purchasePrice = currency(item.total).divide(item.quantity).value;
            }
        )
    }, [ setHelper ]);

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
    }, []);

    const removeItem = React.useCallback((productId: string) => {
        setCart(cart => {
            const modifiedCart = structuredClone({ ...cart });
            
            modifiedCart.items = modifiedCart.items.filter(cartItem => cartItem.product.id !== productId);


            modifiedCart.total = calculaCartTotalPrice(modifiedCart);
            return modifiedCart;
        });
    }, []);

    return {
        addItem,
        changeQuantity,
        getCart,
        setQuantity,
        setSellPrice,
        setTotal,
        removeItem,
        toString
    }
}

export default useCart;