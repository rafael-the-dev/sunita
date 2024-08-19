import { CustomerType } from "@/types/guest"

import { ContactType } from "@/types/contact"
import { Document } from "@/types/user"

import { validate } from "@/validation"
import { isValidName } from "@/validation/user"

import { validateContact, validateDocument } from "../validation/user"

type PropType = "contact" | "document" | "firstName" | "lastName"

const getGuestProxy = (target: CustomerType) => {

    const proxyHandler: ProxyHandler<CustomerType> = {
        set(target: CustomerType, prop: PropType, newValue) {
            switch(prop) {
                case "contact": {
                    validateContact(newValue as ContactType)

                    return Reflect.set(target, prop, newValue);
                }
                case "document": {
                    validateDocument(newValue as Document)

                    return Reflect.set(target, prop, newValue);
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