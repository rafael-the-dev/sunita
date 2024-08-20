import { useMemo } from "react"
import classNames from "classnames"

import { ContactInputType, ContactMethodsType } from "@/hooks/useContact/types"

import Button from "@/components/shared/button"
import Contact from "@/components/shared/contact"

type PropsType = ContactMethodsType & {
    contact: ContactInputType,
    classes?: {
        button?: {
            root?: string,
            self?: string
        },
        list?: string
    }
}

const ContactList = (props: PropsType) => {
    const { addPhoneNumber, classes, contact, changePhone, getAvailableTypes, removePhoneNumber } = props

    const buttonClasses = classes?.button?.self
    const listClasses = classes?.list

    const addContactButtonMemo = useMemo(
        () => (
            <Button
                className={classNames(buttonClasses, "py-2")}
                onClick={addPhoneNumber}>
                Add contact
            </Button>
        ),
        [ addPhoneNumber, buttonClasses ]
    )

    const contactList = useMemo(
        () => (
            <div className={classNames(listClasses, "flex flex-col gap-y-4 items-stretch")}>
                {
                    contact
                        .phone
                        .map(contact => (
                            <Contact 
                                { ...contact }
                                key={contact.type.value}
                                list={getAvailableTypes()}
                                onChange={changePhone}
                                onRemove={removePhoneNumber}
                            />
                        ))
                }
            </div>
        ),
        [ contact, changePhone, getAvailableTypes, listClasses, removePhoneNumber ]
    )

    return (
        <>
            { contactList }
            {
                getAvailableTypes().length > 0 && (
                    <div className={classes?.button?.root}>
                        { addContactButtonMemo }
                    </div>
                )
            }
        </>
    )
}

export default ContactList