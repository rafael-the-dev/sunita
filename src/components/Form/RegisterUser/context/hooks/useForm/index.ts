import { ChangeEvent, useCallback, useMemo, useState } from "react"
import moment from "moment"

import { DOCUMENT_TYPE, USER_CATEGORY, User } from "@/types/user"

import { dateFormat, dateTimeFormat } from "@/helpers/date"

import { 
    isValidDocumentIssueDate, isValidDocumentExpireDate, isValidDocumentNumber, 
    isValidName, isValidUsername, 
    isValidHouseNumber,
    isValidAddress
} from "@/validation/user"

type ChangeNameKeyType = "firstName" | "lastName"
type ChangeAddressKeyType = "country" | "province" | "city" | "block"

const initialInput = {
    error: false,
    helperText: "",
    value: ""
}  

const initial = {
    address: {
        block: initialInput,
        country: initialInput,
        province: initialInput,
        city: initialInput, 
        house: initialInput 
    },
    document: {
        expireDate: structuredClone({ ...initialInput, value: moment(new Date(Date.now())).toISOString() }),
        issueDate: structuredClone({ ...initialInput, value: moment(new Date(Date.now())).toISOString() }),
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

    const changeAddress = useCallback((key: ChangeAddressKeyType) => (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        const hasError = !isValidAddress(value);

        setInput(input => ({
            ...input,
            address: {
                ...input.address,
                [key]: {
                    error: hasError,
                    helperText: hasError ? "It must contain four letters at least" : "",
                    value
                }
            }
        }));
    }, [])

    const changeHouseNumber = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target
            const hasError = !isValidHouseNumber(value)

            setInput(input => ({
                ...input,
                address: {
                    ...input.address,
                    house: {
                        error: hasError,
                        helperText: hasError ? "Invalid house number" : "",
                        value
                    }
                }
            }))
        }, 
        []
    )

    const changeDocumentExpireDate = useCallback((newDate: string) => {
        setInput(input => {
            const hasError = !isValidDocumentExpireDate(newDate, input.document.issueDate.value)

            return {
                ...input,
                document: {
                    ...input.document,
                    expireDate: {
                        error: hasError,
                        helperText: hasError ? "Invalid date" : "",
                        value: newDate
                    }
                }
            }
        })
    }, [])

    const changeDocumentIssueDate = useCallback((newDate: string) => {
        setInput(input => {
            const hasError = !isValidDocumentIssueDate(newDate)

            return {
                ...input,
                document: {
                    ...input.document,
                    issueDate: {
                        error: hasError,
                        helperText: hasError ? "Invalid date" : "",
                        value: newDate
                    }
                }
            }
        })
    }, [])

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

    const changeName = useCallback((key: ChangeNameKeyType) => (e: ChangeEvent<HTMLInputElement>) => {
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
            address: {
                block: "",
                city: "",
                country: "",
                house: 0,
                province: "",
            },
            category: input.position.value,
            document: {
                expireDate: input.document.expireDate.value,
                issueDate: input.document.issueDate.value,
                number: input.document.number.value,
                type: input.document.type.value,
            },
            firstName: input.firstName.value,
            id: null,
            lastName: input.lastName.value,
            password: "",
            stores: null,
            username: input.lastName.value
        }

        return JSON.stringify(user)
    }

    return {
        hasErrors,
        input,

        changeAddress, changeHouseNumber,
        changeDocumentExpireDate, changeDocumentIssueDate, changeDocumentNumber, changeDocumentType, 
        changeName, changePostition, changeUsername,
        resetForm,
        toString
    }

}

export default useForm