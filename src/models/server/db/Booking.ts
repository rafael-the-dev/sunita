
import { BookingDBType } from "@/types/room"
import { ConfigType } from "@/types/app-config-server"
import { SimpleBookingType } from "@/types/room"

import { getId } from "@/helpers/id"
import getBookingProxy from "../proxy/booking"

import Guest from "./Guest"
import Room from "./Room"

type GetAllPropsType = {
    filter?: Object
}

class Booking {
    static async getAll({ filter }: GetAllPropsType, { mongoDbConfig, user }: ConfigType) {
        const  { storeId }  = user.stores[0]

        try {
        const bookings = await mongoDbConfig
            .collections
            .WAREHOUSES
            .aggregate(
                [
                    {
                        $match: {
                            id: storeId
                        }
                    },
                    {
                        $match: filter ?? {}
                    },
                    {
                        $unwind: "$rooms-booking"
                    },
                    {
                        $group: {
                            _id: "$rooms-booking.id",
                            checkIn: { $first: "$rooms-booking.checkIn" },
                            checkOut: { $first: "$rooms-booking.checkOut" },
                            id: { $first: "$rooms-booking.id" },
                            payment: { $first: "$rooms-booking.payment" },
                            room: { $first: "$rooms-booking.room" },
                            type: { $first: "$rooms-booking.type" },
                            totalPrice: { $first: "$rooms-booking.totalPrice" }
                        }
                    }
                ]
            )
            .toArray()
            console.log(bookings)
            return bookings
        } catch(e) {
            console.error(e)
        }
    }

    static async register(clientBooking: SimpleBookingType, { mongoDbConfig, user }: ConfigType) {
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
            { mongoDbConfig, user }
        )

        try {
            const booking: BookingDBType = {
                checkIn: null,
                checkOut: null,
                date: "",
                guest: guest.document.number,
                id, 
                payment: null,
                room: selectedRooom,
                type: null,
                totalPrice: 0
            }

            const bookingProxy = getBookingProxy(booking, totalPrice);

            bookingProxy.checkIn = checkIn;
            booking.checkOut = checkOut;
            bookingProxy.type = type;
            bookingProxy.payment = payment
            
            await Guest.register(guest, { mongoDbConfig, user });

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