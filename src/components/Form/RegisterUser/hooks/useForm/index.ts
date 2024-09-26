import { ChangeEvent, useCallback, useMemo, useState } from "react"

import { DOCUMENT_TYPE, USER_CATEGORY, User } from "@/types/user"
import { isValidDocumentNumber, isValidName, isValidUsername } from "@/validation/user"

type ChangeNameNameKeyType = "firstName" | "lastName"

const initialInput = {
    error: false,
    helperText: "",
    value: ""
}

const initial = {
    document: {
        expireDate: structuredClone(initialInput),
        issueDate: structuredClone(initialInput),
        type: structuredClone({ ...initialInput, value: DOCUMENT_TYPE.DRIVING_LICENCE }), 
        number: structuredClone(initialInput) 
    },
    firstName: structuredClone(initialInput),
    lastName: structuredClone(initialInput),
    position: structuredClone({ ...initialInput, value: USER_CATEGORY.EMPLOYEE }),
    username: structuredClone(initialInput),
}

const useForm = () => {
    const [ input, setInput ] = useState(initial);

    const hasErrors = useMemo(() => {
        return Boolean(
            Object
                .values(input)
                .find(inputProps => {
                    //@ts-ignore
                    if(Object.keys(inputProps).includes("error")) return inputProps.error;

                    return Boolean(
                        Object
                            .values(inputProps)
                            .find(value => value.error)
                    )
                })
            )
    }, [ input ])

    const changeDocumentType = useCallback((documentType: DOCUMENT_TYPE) => {
        setInput(input => ({
            ...input,
            document: {
               ...input.document,
                type:  {
                    error: false,
                    helperText: "",
                    value: documentType
               }
            }
        }))
    }, [])

    const changeDocumentNumber = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        const hasError = !isValidDocumentNumber(value);

        setInput(input => ({
            ...input,
            document: {
                ...input.document,
                 number:  {
                    error: hasError,
                    helperText: "",
                    value
                }
             }
        }));
    }, [])

    const changeName = useCallback((key: ChangeNameNameKeyType) => (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        const hasError = !isValidName(value);

        setInput(input => ({
            ...input,
            [key]: {
                error: hasError,
                helperText: "",
                value
            }
        }));
    }, [])

    const changePostition = useCallback((position: USER_CATEGORY) => {
        setInput(input => ({
            ...input,
            position: {
                error: false,
                helperText: "",
                value: position
            }
        }))
    }, [])

    const changeUsername = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target

        setInput(input => ({
            ...input,
            username: {
                error: !isValidUsername(value),
                helperText: "",
                value
            }
        }))
    }, [])

    const resetForm = useCallback(() => setInput(structuredClone(initial)), [])

    const toString = () => {
        const user: User = {
            address: null,
            category: input.position.value,
            contact: null,
            document: {
                expireDate: input.document.expireDate.value,
                issueDate: input.document.issueDate.value,
                number: input.document.number.value,
                type: input.document.type.value,
            },
            firstName: input.firstName.value,
            id: "",
            lastName: input.lastName.value,
            password: "",
            stores: [],
            username: input.lastName.value,
        }

        return JSON.stringify(user)
    }

    return {
        hasErrors,
        input,

        changeDocumentNumber, changeDocumentType, changeName, changePostition, changeUsername,
        resetForm,
        toString
    }

}

export default useForm