import currency from "currency.js";

import { PaymentMethodType } from "@/types/payment-method";

import { paymentMethodsList } from "@/config/payment-methods";
import { isInvalidNumber } from "./validation";

import InvalidArgumentError from "@/errors/server/InvalidArgumentError";
import { WarehouseProductType } from "@/types/product";
import Error404 from "@/errors/server/404Error";
import { RequestCartItem } from "@/types/cart";

/**
 * 
 * @param paymentMethods is a list of payment methods provided by the client
 * @param total is cart's total price
 * @returns true if total is equal to totalPrice, or
 * throw Invalid argument error is PM's id or amount are invalid
 */
export const isValidPaymentMethods = (paymentMethods: PaymentMethodType[], totalReceived: number) => {
    // pm === payment method
    const totalPrice = paymentMethods.reduce((prevValue, currentPM) => {
        if(isInvalidNumber(currentPM.amount)) throw new InvalidArgumentError("Invalid payment method's amount");

        const isValidPM = paymentMethodsList.find(pm => pm.value === currentPM.id);

        if(!isValidPM) throw new InvalidArgumentError("Invalid payment method");

        return currency(prevValue).add(currentPM.amount).value
    }, 0);

    if(totalPrice !== totalReceived) throw new InvalidArgumentError("Payment methods total price not matching with products price");

    return true;
}

export const isValidCartItemTotalPrice = (item: RequestCartItem, product: WarehouseProductType) => {
    const currentItemTotalPrice = currency(item.quantity).multiply(product.sellPrice).value;
    const isInvalidItemTotalPrice = currentItemTotalPrice !== item.total;

    if(isInvalidItemTotalPrice) {
        throw new InvalidArgumentError(`Invalid item's total price`);
    }

    return true;
}

export const getProduct = (productsMap: Map<string, WarehouseProductType>, id: string) => {
    const product = productsMap.get(id);

    if(!product) throw new Error404(`Product with '${id}' id not found`);

    return product;
};