import { ChangeEvent, useCallback, useMemo, useState } from "react"

import { ContactType, PHONE_TYPE } from "@/types/contact"

import { isValidPhoneType, isValidPhoneNumber } from "@/validation/contact"
import { defaultInputField } from "@/config/input";
import { defaultContact } from "./values";


const useContact = (initialContact?: ContactType) => {
    const [ contact, setContact ] = useState(
        () => {
            if(!initialContact) return defaultContact;

            return {
                phone: initialContact
                    .phone
                    .map(item => (
                        {
                            type: { ...defaultInputField, value: item.type },
                            number: { ...defaultInputField, value: item.number }
                        }
                    ))
            }
        }
    )

    const hasErrors = useMemo(
        () => Boolean(
            contact
                .phone
                .find(item => item.number.error || !Boolean(item.number.value.trim()))
            ),
        [ contact ]
    )

    const getAvailableTypesList = useCallback(
        (contact: typeof defaultContact) => {
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
                                    type: { ...defaultInputField, value: phoneType.value },
                                    number: structuredClone(defaultInputField)
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
        () => setContact(defaultContact),
        []
    )

    const toLiteralObject = (): ContactType => {
        return {
            phone: contact
                .phone
                .map(contact => ({ number: contact.number.value, type: contact.type.value }))
        }
    }

    return {
        hasErrors,

        addPhoneNumber,
        changePhone,
        getAvailableTypes,
        getContact,
        removePhoneNumber,
        resetContact,
        toLiteralObject
    }
}

export default useContact