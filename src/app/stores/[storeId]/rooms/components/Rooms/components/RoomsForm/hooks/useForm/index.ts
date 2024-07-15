import { ChangeEvent, useCallback, useContext, useState } from "react"
import currency from "currency.js"

import { ROOM_TYPE, RoomType } from "@/types/room"

import { FixedTabsContext } from "@/context/FixedTabsContext"

import { isInvalidNumber } from "@/helpers/validation"

const initialInput  = {
    error: false,
    helperText: "",
    value: ""
}

const initial = {
    dailyPrice: structuredClone(initialInput), 
    hourlyPrice: structuredClone(initialInput),
    quantity: structuredClone(initialInput),
    type: structuredClone({ ...initialInput, value: ROOM_TYPE.SINGLE })
}

const useForm = () => {
    const { getDialog } = useContext(FixedTabsContext)

    const room = getDialog().current.payload as RoomType

    const [ input, setInput ] = useState(
        () => {
            if(room) {
                return {
                    dailyPrice: structuredClone({ ...initialInput, value: room.dailyPrice.toString() }), 
                    hourlyPrice: structuredClone({ ...initialInput, value: room.hourlyPrice.toString() }),
                    quantity: structuredClone({ ...initialInput, value: room.quantity.toString() }),
                    type: structuredClone({ ...initialInput, value: room.type })
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
                    quantity: {
                        error: isInvalid,
                        helperText,
                        value
                    }
                })
            );
        },
        []
    );

    const changePrice = useCallback(
        (key: "dailyPrice" | "hourlyPrice") => (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;

            const price = currency(value).value;

            const isInvalid = isInvalidNumber(price, 1);
            
            const helperText = isInvalid ? "Invalid price" : "";

            setInput(
                input => ({
                    ...input,
                    [key]: {
                        error: isInvalid,
                        helperText,
                        value
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
                    type: {
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
        changeQuantity,
        changeType,
        resetForm
    }
}

export default useForm