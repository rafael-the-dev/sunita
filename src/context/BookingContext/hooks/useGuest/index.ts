import { ChangeEvent, useCallback, useState } from "react"

import { BaseBookingType, BookingRoomType, SimpleBookingType } from "@/types/room"

import useDocument from "@/hooks/useDocument"

import { isValidName } from "@/validation/user"

type ChangeNameKeyType = "first" | "last"

const initialInput = {
    error: false,
    helperText: "",
    value: ""
}

const initial = {
    first: structuredClone(initialInput),
    last: structuredClone(initialInput)
}

const useGuest = () => {
    const [ name, setName ] = useState(initial)

    const { document, ...documentRest } = useDocument()

    const changeName = useCallback((key: ChangeNameKeyType) => (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        const hasError = !isValidName(value);

        setName(name => ({
            ...name,
            [key]: {
                error: hasError,
                helperText: "",
                value
            }
        }));
    }, [])

    return {
        ...documentRest,
        guest: {
            document,
            firstName: name.first,
            lastName: name.last
        },
        changeName
    }
}

export default useGuest