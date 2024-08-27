import { ChangeEvent, useCallback, useContext, useMemo, useState } from "react"

import { CustomerType } from "@/types/guest"
import { BookingInfoType } from "@/types/booking"

import { AppContext } from "@/context/AppContext"

import useDocument from "@/hooks/useDocument"
import usePayload from "@/hooks/usePayload"

import { isValidName } from "@/validation/user"
import { defaultInputField } from "@/config/input"
import useContact from "@/hooks/useContact"
import { FixedTabsContext } from "@/context/FixedTabsContext"

type ChangeNameKeyType = "first" | "last"

const initial = {
    first: structuredClone(defaultInputField),
    last: structuredClone(defaultInputField)
}

const useGuest = () => {
    const { getDialog } = useContext(FixedTabsContext);

    const bookingInfo = getDialog().current?.payload as BookingInfoType;
    const hasPayload = Boolean(bookingInfo)

    const [ name, setName ] = useState(
        () => {
            if(!hasPayload) return initial;

            return {
                first: structuredClone({ ...defaultInputField, value: bookingInfo?.guest?.firstName }),
                last: structuredClone({ ...defaultInputField, value: bookingInfo?.guest?.lastName })
            }
        }
    )

    const { getContact, ...contactRest } = useContact(bookingInfo?.guest?.contact);
    const { document, ...documentRest } = useDocument(bookingInfo?.guest?.document);

    const contact = getContact();
    const hasContactErrors = contactRest.hasErrors;
    const hasDocumentErrors = documentRest.hasErrors();

    const hasErrors = useMemo(
        () => {
            const fieldWithErrors =  [ name.first, name.last]
                .find(
                    input => {
                        let hasValueError = false;

                        if(typeof input.value === "string") hasValueError = !Boolean(input.value.trim());
                        
                        return input.error || hasValueError;
                    }
                )
            
            return hasContactErrors || hasDocumentErrors || Boolean(fieldWithErrors)        
        },
        [ hasContactErrors, hasDocumentErrors, name ]
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
    }, []);

    const resetContact = contactRest.resetContact;
    const resetDocument = documentRest.resetDocument;

    const reset = useCallback(
        () => {
            setName(initial);
            resetContact()
            resetDocument();
        },
        [ resetContact, resetDocument ]
    );

    const toLiteralObject = (): CustomerType => {
        return {
            contact: contactRest.toLiteralObject(),
            document: documentRest.toLiteralObject(),
            firstName: name.first.value,
            id: null,
            lastName: name.last.value
        }
    }

    return {
        ...contactRest,
        ...documentRest,
        hasErrors,
        guest: {
            contact,
            document,
            firstName: name.first,
            lastName: name.last
        },
        changeName,
        reset,
        toLiteralObject
    }
}

export default useGuest