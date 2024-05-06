import { isLessOrEqualToZero } from "@/helpers/stock-report";
import { CartType } from "@/types/cart";
import { ProductInfoType } from "@/types/product";
import currency from "currency.js";


export const isValidPrice = (cart: CartType<ProductInfoType>) => {
    let result = true;

    const total = cart.items.reduce((prevValue, currentItem) => {
        if(isLessOrEqualToZero(currentItem.quantity))
            result = false;

        const { product } = currentItem;

        const currentItemTotal = currency(currentItem.quantity).multiply(product.purchasePrice).value;

        if(currentItem.total !== currentItemTotal) 
            result = false;

        if(product.purchasePrice >= product.sellPrice)
            result = false;

        return currency(prevValue).add(currentItem.total).value;
    }, 0);

    if(total !== cart.total)
        result = false;

    return result;
};