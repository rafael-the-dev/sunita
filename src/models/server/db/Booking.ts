import currency from "currency.js"
import moment from "moment"

import { BookingType, BookingDBType, BOOKING_STATUS } from "@/types/booking"
import { ConfigType, FiltersType } from "@/types/app-config-server"

import { getId } from "@/helpers/id"
import { toISOString } from "@/helpers/date"
import getBookingProxy from "../proxy/booking"
import { getBookings, isBookingAvailable } from "@/helpers/booking"
import { sort } from "@/helpers/sort"

import Error404 from "@/errors/server/404Error"
import InvalidArgumentError from "@/errors/server/InvalidArgumentError"

import Guest from "./Customer"
import Property from "./Property"

type GetAllPropsType = {
    filters?: FiltersType
}

class Booking {
    static async getAll({ filters }: GetAllPropsType, config: ConfigType) {
        const bookings = await getBookings({ filters }, config)

        const totalPrice = bookings.reduce(
            (prevValue, currentBooking) => {
                return currency(prevValue).add(currentBooking.totalPrice).value
            }, 
            0
        )

        sort(bookings, "checkIn")

        return {
            data: {
                list: bookings,
                total: totalPrice
            }
        }
    }

    static async get({ filters }: GetAllPropsType, config: ConfigType) {
        const bookings = await getBookings({ filters }, config)
        
        if(bookings.length === 0) throw new Error404("Booking not found");

        return bookings[0];
    }

    static async register(clientBooking: BookingType, config: ConfigType) {
        const { mongoDbConfig, user } = config;

        const id = getId();
        const  { storeId }  = user.stores[0];

        const {
            checkIn, checkOut,
            guest,
            payment,
            property,
            type,
            totalPrice
        } = clientBooking;

        const selectedProperty = await Property.get(
            {
                filter: {
                    id: property
                }
            }, 
            config
        );
        
        const isAvailable = await isBookingAvailable(clientBooking, config)
        
        if(!isAvailable) throw new InvalidArgumentError("Room not available, It is already booked.");
        
        const guestId = await Guest.register(guest, "GUESTS", config);

        try {
            const booking: BookingDBType = {
                code: getId(),
                createdAt: toISOString(Date.now()),
                checkIn: null,
                checkOut: null,
                date: toISOString(moment(checkIn)),
                guest: guestId,
                id, 
                owner: storeId,
                payment: null,
                property: selectedProperty.id,
                status: BOOKING_STATUS.PENDING,
                type: null,
                totalPrice: 0
            };
            
            const bookingProxy = getBookingProxy(booking, totalPrice, selectedProperty);

            bookingProxy.checkIn = checkIn;
            booking.checkOut = checkOut;
            bookingProxy.type = type;
            bookingProxy.payment = payment

            await mongoDbConfig
                .collections
                .BOOKINGS
                .insertOne(booking);
        } catch(e) {
            await mongoDbConfig
                .collections
                .BOOKINGS
                .deleteOne(
                    { id: storeId }
                );

            throw e;
        }
    }   

    static async update(updatedBooking: BookingType, config: ConfigType) {
        const { mongoDbConfig, user } = config;

        const [ currentBooking, property ] = await Promise.all(
            [
                this.get(
                    {
                        filters: {
                            id:updatedBooking.id,
                        }
                    },
                    config
                ),
                Property.get(
                    { 
                        filter: { 
                            id: updatedBooking.property 
                        }
                    }, 
                    config
                )
            ]
        )

        const booking = structuredClone(
            { 
                ...currentBooking, 
                guest: currentBooking.guest.id,
                property: currentBooking.property.id 
            }
        )

        const bookingClone = structuredClone(booking)

        const update = async (booking: BookingDBType) => {
            //@ts-ignore
            const { _id, ...bookingRest } = booking

            await mongoDbConfig
                .collections
                .BOOKINGS
                .updateOne(
                    { id: updatedBooking.id },
                    {
                        $set: bookingRest
                    }
                );
        }

        const isAvailable = await isBookingAvailable(updatedBooking, config)
        
        if(!isAvailable) throw new InvalidArgumentError("Room not available, It is already booked.");
        
        try {
            bookingClone.checkIn = null
            bookingClone.checkOut = null
            
            const bookingProxy = getBookingProxy(bookingClone, updatedBooking.totalPrice, property);

            bookingProxy.checkOut = updatedBooking.checkOut;
            bookingProxy.checkIn = updatedBooking.checkIn;
            bookingProxy.type = updatedBooking.type;
            bookingProxy.payment = updatedBooking.payment
            //bookingProxy.status = updatedBooking.status;

            await update(bookingClone);
        } catch(e) {
            await update(booking);

            throw e;
        }
    }   
}

export default Booking