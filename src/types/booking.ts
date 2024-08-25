import { BOOKING_TYPE } from "./room";
import { GuestType } from "./guest";
import { ProductPayment as PaymentMethod } from "./payment-method"
import { PropertyType } from "./property";

export type BaseBookingType = {
    checkIn: string | Date;
    checkOut: string | Date;
    date: string | Date;
    id: String,
    owner: String,
    payment: PaymentMethod,
    type: BOOKING_TYPE,
    totalPrice: number
}

export type BookingType = BaseBookingType & {
    guest: GuestType,
    property: string
}

export type BookingDBType = BaseBookingType & {
    guest: string,
    property: string,
}

export type BookingInfoType = BaseBookingType & {
    guest: GuestType,
    property: PropertyType
}
