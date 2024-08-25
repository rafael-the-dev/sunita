import { ChangeEvent, useCallback, useContext, useMemo } from "react"
import moment from "moment"

import { BOOKING_TYPE, ROOM_TYPE } from "@/types/room"

import { BookingContext } from "@/context/BookingContext"
import { RoomsContext } from "@/app/stores/[storeId]/rooms/context"

import { getMinCheckOutTime } from "@/helpers/booking"

import DateTime from "@/components/date"
import Row from "@/components/Form/RegisterUser/components/Row"
import Select from "@/components/shared/combobox"

const BaseDetails = () => {
    const { getProperties } = useContext(RoomsContext)

    const { 
        booking,
        changeRoom, changeType, changeTime
    } = useContext(BookingContext)

    const bookingType = booking.type.value

    const propertiesList = useMemo(
        () => {
            return getProperties().map(
                property => ({
                    label: `${property.type}     ${ bookingType === BOOKING_TYPE.HOURLY ? `${property.price.hourly}MT/h` : `${property.price.daily}MT/d`}`,
                    value: property.id
                })
            )
        },
        [ bookingType, getProperties ]
    )

    const bookingTypesList = useMemo(
        () => Object
            .values(BOOKING_TYPE)
            .map(item => ({
                label: item,
                value: item
            })),
        []
    )

    const roomChangeHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => changeRoom(e.target.value),
        [ changeRoom ]
    )

    const selectChangeHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => changeType(e.target.value as BOOKING_TYPE),
        [ changeType ]
    )
    
    return (
        <div className="flex flex-col gap-y-4 items-stretch">
            <Row>
                <Select 
                    { ...booking.type }
                    className="mb-0 w-full sm:w-1/2"
                    label="Type"
                    list={bookingTypesList}
                    onChange={selectChangeHandler}
                />
                <Select 
                    className="mb-0 w-full sm:w-1/2"
                    label="Select a property"
                    list={propertiesList}
                    onChange={roomChangeHandler}
                    value={ booking?.property?.id }
                />
            </Row>
            <Row>
                <DateTime 
                    { ...booking.checkIn }
                    className="mb-0 w-full sm:w-1/2"
                    label="Check in"
                    onChange={booking.property ? changeTime("checkIn") : () => {}}
                />
                <DateTime 
                    { ...booking.checkOut }
                    className="mb-0 w-full sm:w-1/2"
                    label="Check out"
                    onChange={booking.property ? changeTime("checkOut") : () => {}}
                />
            </Row>
            <div className="flex justify-end"> 
                <div className="font-semibold text-lg">
                    { booking.totalPrice } MT
                </div>
            </div>
        </div>
    )
}

export default BaseDetails