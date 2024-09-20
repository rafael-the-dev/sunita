import { ChangeEvent } from "react"
import classNames from "classnames"

import { PHONE_TYPE } from "@/types/contact"
import { ContactInputType } from "@/hooks/useContact/types"

import Button from "@/components/shared/button"
import Contact from "@/components/shared/contact"

type PropsType = {
    classes?: {
        button?: string
    },
    contact: ContactInputType,
    onAddContact: () => void,
    onChange: (id: PHONE_TYPE, prop: "number" | "type") => (e: ChangeEvent<HTMLInputElement>) => void,
    onRemove: (id: PHONE_TYPE) => () => void,
}

const ContactContainer = ({ contact, classes, onAddContact, onChange, onRemove }: PropsType) => {

    return (
        <>
            <div className="flex flex-col gap-y-6 items-stretch">
                {
                    contact
                        .phone
                        .map(phone => (
                            <Contact 
                                { ...phone }
                                key={phone.type.value}
                                list={[]}
                                onChange={onChange}
                                onRemove={onRemove}
                            />
                        ))
                }
            </div>
            <Button
                className={classNames(classes?.button, "py-2 px-8 w-fit")}
                onClick={onAddContact}>
                Add new contact
            </Button>
        </>
    )
}

export default ContactContainer