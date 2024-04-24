import currency from "currency.js";

import { CartType } from "@/types/cart";

export const calculateProductTotalPrice = (price: number, quantity: number) => currency(price).multiply(quantity).value;

export const calculaCartTotalPrice = <T>(cart: CartType<T>): number => {
    return cart.items.reduce((prevValue, currentCartItem) => {
        return currency(prevValue).add(currentCartItem.total).value
    }, 0);
};