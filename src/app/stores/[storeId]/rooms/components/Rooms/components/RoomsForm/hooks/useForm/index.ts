import { ChangeEvent, useCallback, useState } from "react"
import currency from "currency.js"

import { ROOM_TYPE } from "@/types/room"

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
    const [ input, setInput ] = useState(initial);

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