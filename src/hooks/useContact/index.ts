import { ChangeEvent, useCallback, useMemo, useState } from "react"

import { ContactType, PHONE_TYPE } from "@/types/contact"

import { isValidPhoneType, isValidPhoneNumber } from "@/validation/contact"

type InputType = {
    error: boolean;
    helperText: string;
    value: string;
}

type InputContactType = {
    phone: {
        number: InputType,
        type: InputType & { value: PHONE_TYPE }
    }[]
}

const initialInput = {
    error: false,
    helperText: "",
    value: ""
}

const initialContact: InputContactType = {
    phone: [
        {
            type: { ...initialInput, value: PHONE_TYPE.WORK },
            number: structuredClone(initialInput)
        }
    ]
}

const useContact = () => {
    const [ contact, setContact ] = useState(initialContact)

    const hasErrors = useMemo(
        () => Boolean(
            contact
                .phone
                .find(item => item.number.error || !Boolean(item.number.value.trim()))
        ),
        [ contact ]
    )

    const getAvailableTypesList = useCallback(
        (contact: InputContactType) => {
            return Object
                .values(PHONE_TYPE)
                .filter(
                    phoneType => !Boolean(
                        contact
                            .phone
                            .find(
                                phone => phone.type.value === phoneType
                            )
                    )
                )
                .map(phoneType => ({ label: phoneType, value: phoneType}))
        },
        []
    )

    const getAvailableTypes = useCallback(
        () => getAvailableTypesList(contact)
        ,
        [ contact, getAvailableTypesList ]
    )

    const getContact = useCallback(
        () => structuredClone(contact),
        [ contact ]
    )

    const addPhoneNumber = useCallback(
        () => {
            setContact(
                contact => {
                    const list = getAvailableTypesList(contact)

                    if(list.length === 0) return contact;

                    const contactClone = structuredClone(contact)

                    const phoneType = list[0]

                    if(phoneType) {
                        contactClone
                            .phone
                            .push(
                                {
                                    type: { ...initialInput, value: phoneType.value },
                                    number: structuredClone(initialInput)
                                }
                            )
                    }

                    return contactClone
                }
            )
        }, 
        [ getAvailableTypesList ]
    )

    const changePhone = useCallback(
        (id: PHONE_TYPE, prop: "number" | "type") => (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;

            setContact(
                contact => {
                    const contactClone = structuredClone(contact);

                    const phoneItem = contactClone
                        .phone
                        .find(item => item.type.value === id);

                    if(!phoneItem) return contact;

                    if(prop === "number") {
                        const hasError = !isValidPhoneNumber(value);

                        phoneItem.number.value = value;
                        phoneItem.number.error = hasError;
                    } else {
                        const hasError = !isValidPhoneType(value as PHONE_TYPE);

                        phoneItem.type.value = value as PHONE_TYPE;
                        phoneItem.type.error = hasError;
                    }

                    return contactClone;
                }
            )
        },
        [ ]
    )

    const removePhoneNumber = useCallback(
        (id: PHONE_TYPE) => () => {
            setContact(contact => {
                const contactClone = structuredClone(contact)

                contactClone.phone = contactClone
                    .phone
                    .filter(phoneInput => phoneInput.type.value !== id)

                return contactClone
            })
        },
        []
    )

    const resetContact = useCallback(
        () => setContact(initialContact),
        []
    )

    return {
        hasErrors,

        addPhoneNumber,
        changePhone,
        getAvailableTypes,
        getContact,
        removePhoneNumber,
        resetContact
    }
}

export default useContact