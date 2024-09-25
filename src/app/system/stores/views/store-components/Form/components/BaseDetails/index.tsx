import { useContext } from "react"

import { FormContext } from "../../context"

import Address from "@/components/Container/Address"
import Contact from "@/components/Container/Contact"
import Legend from "@/components/shared/Legend"
import Textfield from "@/components/Textfield"

const BaseDetails = () => {
    const { 
        address,
        contact, 
        name,
        nameChangeHandler
    } = useContext(FormContext)

    return (
        <div className="flex flex-col items-stretch grow gap-y-4">
            <Textfield 
                { ...name }
                className="mb-0 w-full"
                label="Name"
                onChange={nameChangeHandler}
                placeholder="Inset store name"
            />
            <fieldset className="flex flex-col gap-y-4 mt-6">
                <Legend
                    className="mb-6">
                    Contact
                </Legend>
                <div className="flex flex-col gap-y-4">
                    <Contact 
                        contact={contact.getContact()}
                        onAddContact={contact.addPhoneNumber}
                        onChange={contact.changePhone}
                        onRemove={contact.removePhoneNumber}
                    />
                </div>
            </fieldset>
            <fieldset className="flex flex-col gap-y-4 mt-6">
                <Legend
                    className="mb-6">
                    Address
                </Legend>
                <Address { ...address } hasCords onLocationFound={address.setCords} />
            </fieldset>
        </div>
    )
}

export default BaseDetails