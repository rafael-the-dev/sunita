
import { Document } from "./user"
import { ProductPayment as PaymentMethod } from "./payment-method"

export enum ROOM_TYPE {
    DOUBLE = "double",
    SUIT = "suit",
    SINGLE = "single"
}

export type RoomType = {
    dailyPrice: number,
    hourlyPrice: number,
    quantity: number,
    type: ROOM_TYPE
}

export type GuestType = {
    document: Document,
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
}

export enum BOOKING_TYPE {
    DAILY = "daily",
    HOURLY = "hourly"
}

export type BaseBookingType = {
    checkIn: string | Date;
    checkOut: string | Date;
    date: string | Date;
    id: String,
    paymentMethods: PaymentMethod,
    room: RoomType,
    store: string,
    type: BOOKING_TYPE,
    totalPrice: number
}

export type SimpleBookingType = BaseBookingType & {
    guest: string | GuestType
}

export type BookingRoomType = BaseBookingType & {
    guest: GuestType,
}