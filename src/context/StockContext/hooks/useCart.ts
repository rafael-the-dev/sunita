import * as React from "react";
import currency from "currency.js"

import { CartItem, CartType } from "@/types/cart";
import { ProductInfoType } from "@/types/product";
import { SetterFuncType, StockContextType } from "../types";
import { StockReportInfoType } from "@/types/stock"
import { AppContext } from "@/context/AppContext";

import { calculaCartTotalPrice, calculateProductTotalPrice } from "@/helpers/cart";
import { getId } from "@/helpers/id";
import { isInvalidNumber } from "@/helpers/validation";

export const StockContext = React.createContext<StockContextType | null>(null);
StockContext.displayName = "StockContext";

const initialState = {
    items: [],
    total:0
};

const useCart = () => {
    const { dialog } = React.useContext(AppContext);

    const [ cart, setCart ] = React.useState<CartType<ProductInfoType>>(() => {
        if(dialog?.payload) {
            const { items, total } = dialog.payload as StockReportInfoType;
            return {
                items,
                total
            }
        }

        return initialState;
    });

    const getCart = React.useCallback(() => structuredClone(cart), [ cart ]);

    const addItem = React.useCallback((product: ProductInfoType, quantity: number) => {
        setCart(cart => {
            const modifiedCart = structuredClone({ ...cart });
            
            const item = modifiedCart.items.find(cartItem => cartItem.product.id === product.id);

            if(item) {
                item.quantity = currency(item.quantity).add(quantity).value;
                item.total = calculateProductTotalPrice(item.product.purchasePrice, item.quantity);
            } else {
                const item = {
                    id: getId(),
                    product: {
                        ...product
                    },
                    quantity,
                    total: calculateProductTotalPrice(product.purchasePrice, quantity)
                };

                item.product.profit = currency(item.product.sellPrice).subtract(item.product.purchasePrice).value;

                modifiedCart.items.push(item)
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
            item.product.profit = currency(item.product.sellPrice).subtract(item.product.purchasePrice).value;
            
            modifiedCart.total = calculaCartTotalPrice(modifiedCart);
            return modifiedCart;
        })
    }, []); 

    const setQuantity: SetterFuncType = React.useCallback(( product, value, type) => {
        setHelper(
            product, 
            value, 
            item => { 
                const currentQuantity = item.quantity;

                if(type === "CHANGE") item.quantity = currency(value).value;
                else item.quantity = currency(item.quantity).add(value).value;

                //validate quantity, then set its value to 1 if is not valid
                if(isInvalidNumber(item.quantity)) item.quantity = 1;

                item.product.purchasePrice = currency(item.total).divide(item.quantity).value;
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

                //validate sellPrice, then set its value to 1 if is not valid
                if(isInvalidNumber(item.product.sellPrice)) item.product.sellPrice = 1;
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

                if(isInvalidNumber(item.total)) item.total = 1;

                //validate Total, then set its value to 1 if is not valid
                item.product.purchasePrice = currency(item.total).divide(item.quantity).value;
            }
        )
    }, [ setHelper ]);

    const reset = React.useCallback(() => {
        setCart(structuredClone(initialState))
    }, [])

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
        getCart,
        setQuantity,
        setSellPrice,
        setTotal,
        removeItem, reset,
        toString
    }
}

export default useCart;