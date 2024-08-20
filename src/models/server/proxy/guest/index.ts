import { GuestDBType, GuestType } from "@/types/guest"

import { Document } from "@/types/user"

import { validate } from "@/validation"
import { isValidName } from "@/validation/user"
import { validateContact, validateDocument } from "../validation/user"

import { ContactType } from "@/types/contact"

type PropType = "contact" | "document" | "firstName" | "lastName"

const getGuestProxy = (target: GuestType) => {

    const proxyHandler: ProxyHandler<GuestType> = {
        set(target: GuestType, prop: PropType, newValue) {
            switch(prop) {
                case "contact": {
                    const contact = newValue as ContactType

                    validateContact(contact)

                    return Reflect.set(target, prop, contact);
                }
                case "document": {
                    const document = newValue as Document

                    validateDocument(document)

                    return Reflect.set(target, prop, document);
                }
                case "firstName": {
                    validate(newValue as string, "Invalid first name.", isValidName);
                    return Reflect.set(target, prop, newValue);
                }
                case "lastName": {
                    validate(newValue as string, "Invalid last name.", isValidName);
                    return Reflect.set(target, prop, newValue);
                }
            } 

            return false
        }
    }

    return new Proxy(target, proxyHandler)
}

export default getGuestProxy