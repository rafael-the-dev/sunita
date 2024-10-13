import { ChangeEvent, useCallback, useContext, useMemo } from "react"

import { BOOKING_TYPE } from "@/types/room"
import {LANGUAGE} from "@/types/language"

import { BookingContext } from "@/context/BookingContext"
import { RoomsContext } from "@/app/stores/[storeId]/rooms/context"

import lang from "../../lang.json"

import { getList } from "@/helpers"

import useLanguage from "@/hooks/useLanguage"

import DateTime from "@/components/date"
import Row from "@/components/Form/RegisterUser/components/Row"
import Select from "@/components/shared/combobox"

const bookingTypesList = getList(BOOKING_TYPE)

const BaseDetails = () => {
    const { getProperties } = useContext(RoomsContext)

    const { language } = useLanguage()

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
                    label={ lang["base"]["type"][language] }
                    list={bookingTypesList}
                    onChange={selectChangeHandler}
                />
                <Select 
                    className="mb-0 w-full sm:w-1/2"
                    label={ lang["base"]["property"][language] }
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
            {
                booking.totalPrice > 0 && (
                    <div className="flex justify-end"> 
                        <div className="font-semibold text-lg">
                            { booking.totalPrice } MT
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default BaseDetails