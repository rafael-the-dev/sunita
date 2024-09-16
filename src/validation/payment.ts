import currency from "currency.js"

import { PaymentType, PaymentMethodType, PAYMENT_METHODS } from "@/types/payment-method"

import { isValidPrice } from "./product"

export const isInvalidTransactionId = (paymentMethods: PaymentMethodType[]) => {
    const invalidPM = paymentMethods
        .filter(pm => pm.id !== PAYMENT_METHODS.CASH)
        .find(pm => !Boolean(pm.transactionId?.trim()))

    return Boolean(invalidPM)
}

export const hasInvalidAmount = (paymentMethods: PaymentMethodType[]) => {
    const invalidPM = paymentMethods.find(pm => !isValidPrice(pm.amount?.toString()) || currency(pm.amount).value <= 0)

    return Boolean(invalidPM)
}

/**
 * 
 * @param payment 
 * @param totalPrice 
 * @returns false, If PMs transaction is not valid or total received amount is less than total price or 
 * total price is less than or equal to zero
 */
export const isValidPayment = (payment: PaymentType, totalPrice: number) => {
    if(isInvalidTransactionId(payment.paymentMethods)) return false;

    const isInvalidAmount = payment.totalReceived < totalPrice || totalPrice <= 0;

    if(isInvalidAmount) return false;

    if(hasInvalidAmount(payment.paymentMethods)) return false

    return true
}