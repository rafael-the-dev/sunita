
import { Document } from "./user"
import { ProductPayment as PaymentMethod } from "./payment-method"
import { STATUS } from ".";

export enum ROOM_TYPE {
    DOUBLE = "double",
    SUIT = "suit",
    SINGLE = "single"
}

export type RoomType = {
    dailyPrice: number,
    hourlyPrice: number,
    id: string,
    quantity: number,
    status: STATUS;
    type: ROOM_TYPE
}

export type GuestType = {
    document: Document,
    email?: string;
    firstName: string;
    lastName: string;
    phone?: string;
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
    payment: PaymentMethod,
    room: RoomType,
    type: BOOKING_TYPE,
    totalPrice: number
}

export type BookingDBType = BaseBookingType & {
    guest: string
}

export type SimpleBookingType = BaseBookingType & {
    guest: GuestType,
    store: string,
}

export type BookingRoomType = BaseBookingType & {
    guest: GuestType,
    store: string,
}