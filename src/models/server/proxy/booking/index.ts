
import { BOOKING_TYPE, BookingDBType } from "@/types/room"
import { PaymentType } from "@/types/payment-method"

import { validate } from "@/validation"

import { getTotalPrice, calculatePayment } from "@/helpers/booking"
import { isInvalidNumber } from "@/helpers/validation"

import { 
    isValidBookingType, 
    validateCheckIn, 
    validateCheckOut 
} from "@/validation/booking"

import InvalidArgumentError from "@/errors/server/InvalidArgumentError"

type PropType = "checkIn" | "checkOut" | "payment" | "type"

const getBookingProxy = (target: BookingDBType, userTotalPrice: number) => {

    const proxyHandler: ProxyHandler<BookingDBType> = {
        set(target: BookingDBType, prop: PropType, newValue) {
            switch(prop) {
                case "checkIn": {
                    const { hasError, message } = validateCheckIn(newValue, target.checkOut);

                    if(hasError) {
                        throw new InvalidArgumentError(message);
                    }

                    return Reflect.set(target, prop, newValue);
                }
                case "checkOut": {
                    const { hasError, message } = validateCheckOut(target.checkIn, newValue);

                    if(hasError) {
                        throw new InvalidArgumentError(message);
                    }

                    return Reflect.set(target, prop, newValue);
                }
                case "payment": {
                    const payment = newValue as PaymentType
                    const paymentClone = structuredClone(payment)

                    if(isInvalidNumber(payment.totalReceived, target.totalPrice)) throw new InvalidArgumentError("Invalid total reveived amount");
                    if(isInvalidNumber(payment.changes, 0)) throw new InvalidArgumentError("Invalid payment changes");
                    if(isInvalidNumber(payment.remainingAmount, 0)) throw new InvalidArgumentError("Invalid payment remainig amount");

                    calculatePayment(paymentClone, target.totalPrice)

                    if(paymentClone.changes !== payment.changes) {
                        throw new InvalidArgumentError("Payment changes are not correct")
                    }

                    if(paymentClone.remainingAmount !== payment.remainingAmount) {
                        throw new InvalidArgumentError("Payment remaining amount is not correct")
                    }

                    if(paymentClone.totalReceived !== payment.totalReceived || paymentClone.totalReceived < target.totalPrice) {
                        throw new InvalidArgumentError("Payment received is invalid")
                    }

                    return Reflect.set(target, prop, newValue);
                }
                case "type": {
                    const bookingType = newValue as BOOKING_TYPE;

                    validate(bookingType, "Invalid booking type", isValidBookingType);

                    const totalPrice = getTotalPrice(bookingType, target.checkIn, target.checkOut, target.room);
                    
                    if(totalPrice !== userTotalPrice) throw new InvalidArgumentError("Server total price doesn't match with client total price.");

                    target.totalPrice = totalPrice;

                    return Reflect.set(target, prop, newValue);
                }
            }

            return false
        }
    }

    return new Proxy(target, proxyHandler)
}

export default getBookingProxy