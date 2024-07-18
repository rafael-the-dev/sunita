import { ChangeEvent, useCallback, useMemo, useState } from "react"

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

    const hasErrors = useMemo(
        () => {
            return Boolean([
                name.first,
                name.last,
                document.expireDate,
                document.issueDate,
                document.number,
                document.type
            ].find(
                input => {
                    let hasValueError = false;

                    if(typeof input.value === "string") hasValueError = !Boolean(input.value.trim());
                    
                    return input.error || hasValueError;
                }
            ))
        },
        [ document, name ]
    )

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
        hasErrors,
        guest: {
            document,
            firstName: name.first,
            lastName: name.last
        },
        changeName
    }
}

export default useGuest