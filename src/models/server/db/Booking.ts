import moment from "moment"

import { BookingType, BookingDBType } from "@/types/booking"
import { ConfigType, FiltersType } from "@/types/app-config-server"

import { getId } from "@/helpers/id"
import { toISOString } from "@/helpers/date"
import getBookingProxy from "../proxy/booking"
import { getBookings, isBookingAvailable } from "@/helpers/booking"

import Error404 from "@/errors/server/404Error"
import InvalidArgumentError from "@/errors/server/InvalidArgumentError"

import Guest from "./Customer"
import Property from "./Property"
import Room from "./Room"

type GetAllPropsType = {
    filters?: FiltersType
}

class Booking {
    static async getAll({ filters }: GetAllPropsType, config: ConfigType) {
        return await getBookings({ filters }, config)
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

        try {
            const booking: BookingDBType = {
                checkIn: null,
                checkOut: null,
                date: toISOString(moment(checkIn)),
                guest: guest.id,
                id, 
                owner: storeId,
                payment: null,
                property: selectedProperty.id,
                type: null,
                totalPrice: 0
            };
            
            const bookingProxy = getBookingProxy(booking, totalPrice, selectedProperty);

            bookingProxy.checkIn = checkIn;
            booking.checkOut = checkOut;
            bookingProxy.type = type;
            bookingProxy.payment = payment
            
            await Guest.register(guest, "GUESTS", config);

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
}

export default Booking