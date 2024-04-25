import { CartType } from "@/types/cart";
import { ProductPayment } from "@/types/payment-method";
import { ProductInfoType } from "@/types/product";
import currency from "currency.js";


export const getPaymentStats = <T>(cart: CartType<T>, payment: ProductPayment) => {
    const totalAmount = payment.paymentMethods.reduce((prevValue, currentPaymentMethod) => {
        return currency(currentPaymentMethod.amount).add(prevValue).value
    }, 0)

    return {
        totalAmount,
        totalRemainingAmount: currency(cart.total).subtract(totalAmount).value,
        totalChanges: currency(totalAmount).subtract(cart.total).value
    }
}

export const setTotalReceivedAmountAndChanges = <T>(cart: CartType<T>, payment: ProductPayment) => {
    const stats = getPaymentStats(cart, payment);

    payment.changes = stats.totalChanges;
    payment.remainingAmount = stats.totalRemainingAmount;
    payment.totalReceived = stats.totalAmount;
}