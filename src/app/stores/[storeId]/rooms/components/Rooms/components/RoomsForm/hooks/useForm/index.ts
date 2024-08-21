import { ChangeEvent, useCallback, useContext, useState } from "react"
import currency from "currency.js"

import { ROOM_TYPE, RoomType } from "@/types/room"

import { FixedTabsContext } from "@/context/FixedTabsContext"

import { isInvalidNumber } from "@/helpers/validation"
import { defaultInputField } from "@/config/input"
import { PROPERTY_TYPE } from "@/types/property"

const initialInput  = defaultInputField

const initial = {
    bedRoom: {
        quantity: structuredClone(initialInput),
        type: structuredClone({ ...initialInput, value: ROOM_TYPE.SINGLE })
    },
    price: {
        hour: structuredClone(initialInput),
        day: structuredClone(initialInput),
        night: structuredClone(initialInput)
    },
    propertyType: structuredClone({ ...initialInput, value: PROPERTY_TYPE.BED_ROOM })
}

const useForm = () => {
    const { getDialog } = useContext(FixedTabsContext)

    const room = getDialog().current.payload as RoomType

    const [ input, setInput ] = useState(
        () => {
            if(room) {
                return {
                    bedRoom: {
                        quantity: structuredClone({ ...initialInput, value: room.quantity.toString() }),
                        type: structuredClone({ ...initialInput, value: room.type })
                    },
                    price: {
                        day: structuredClone({ ...initialInput, value: room.dailyPrice.toString() }), 
                        hour: structuredClone({ ...initialInput, value: room.hourlyPrice.toString() }),
                        night: structuredClone({ ...initialInput, value: room.hourlyPrice.toString() }),
                    },
                    propertyType: structuredClone({ ...initialInput, value: room.quantity.toString() }),
                }
            }

            return initial
        }
    );

    const changeQuantity = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;

            const quantity = parseInt(value);

            const isInvalid = isInvalidNumber(quantity, 1);

            const helperText = isInvalid ? "Invalid number" : "";

            setInput(
                input => ({
                    ...input,
                    bedRoom: {
                        ...input.bedRoom,
                        quantity: {
                            error: isInvalid,
                            helperText,
                            value
                        }
                    }
                })
            );
        },
        []
    );

    const changePrice = useCallback(
        (key: "day" | "hour" | "night") => (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;

            const price = currency(value).value;

            const isInvalid = isInvalidNumber(price, 1);
            
            const helperText = isInvalid ? "Invalid price" : "";

            setInput(
                input => ({
                    ...input,
                    price: {
                        ...input.price,
                        [key]: {
                            error: isInvalid,
                            helperText,
                            value
                        }
                    }
                })
            );
        },
        []
    );

    const changeType = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const value  = e.target.value as ROOM_TYPE;

            setInput(
                input => ({
                    ...input,
                    bedRoom: {
                        ...input.bedRoom,
                        type: {
                            error: false,
                            helperText: "",
                            value
                        }
                    }
                })
            );
        },
        []
    );

    const changePropertyType = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const value  = e.target.value as PROPERTY_TYPE;

            setInput(
                input => ({
                    ...input,
                    propertyType: {
                        error: false,
                        helperText: "",
                        value
                    }
                })
            );
        },
        []
    );

    const resetForm = useCallback(
        () => setInput(initial),
        []
    )

    return {
        input,

        changePrice,
        changePropertyType,
        changeQuantity,
        changeType,
        resetForm
    }
}

export default useForm