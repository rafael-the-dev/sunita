import moment from "moment"

import { BookingDBType } from "@/types/room"
import { ConfigType } from "@/types/app-config-server"
import { SimpleBookingType } from "@/types/room"

import { getId } from "@/helpers/id"
import { toISOString } from "@/helpers/date"
import getBookingProxy from "../proxy/booking"
import { getBookings, isBookingAvailable } from "@/helpers/booking"

import Error404 from "@/errors/server/404Error"
import InvalidArgumentError from "@/errors/server/InvalidArgumentError"

import Guest from "./Guest"
import Room from "./Room"

type GetAllPropsType = {
    filters?: {
        $match: {[key: string]: string | Object }
    }[]
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

    static async register(clientBooking: SimpleBookingType, config: ConfigType) {
        const { mongoDbConfig, user } = config;

        const id = getId();
        const  { storeId }  = user.stores[0];

        const {
            checkIn, checkOut,
            guest,
            payment,
            room,
            type,
            totalPrice
        } = clientBooking;

        const selectedRooom = await Room.get(
            {
                filter: {
                    "rooms.id": room.id
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
                guest: guest.document.number,
                id, 
                payment: null,
                room: selectedRooom,
                type: null,
                totalPrice: 0
            };
            
            const bookingProxy = getBookingProxy(booking, totalPrice);

            bookingProxy.checkIn = checkIn;
            booking.checkOut = checkOut;
            bookingProxy.type = type;
            bookingProxy.payment = payment
            
            await Guest.register(guest, config);

            await mongoDbConfig
                .collections
                .WAREHOUSES
                .updateOne(
                    { id: storeId },
                    {
                        $push: {
                            "rooms-booking": booking
                        }
                    }
                );
        } catch(e) {
            await mongoDbConfig
                .collections
                .WAREHOUSES
                .updateOne(
                    { id: storeId },
                    {
                        $pull: {
                            "rooms-booking": {
                                id
                            }
                        }
                    }
                );

            throw e;
        }
    }   
}

export default Booking