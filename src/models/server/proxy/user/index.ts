
import InvalidArgumentError from "@/errors/server/InvalidArgumentError"
import { AddressType, BaseUserType, Document, USER_CATEGORY, User } from "@/types/user"

import { 
    isValidAddress, 
    isValidDocumentExpireDate, isValidDocumentIssueDate, isValidDocumentNumber, isValidDocumentType, 
    isValidHouseNumber, isValidName, isValidUsername 
} from "@/validation/user"

type PropType = "address" | "category" | "document" | "firstName" | "lastName" | "password" | "username"

const validate = (value: string, errorMessage: string, fn: (value: string | Date) => boolean) => {
    if(!fn(value)) {
        throw new InvalidArgumentError(errorMessage)
    }
}

export const getUserProxy = (target: User) => {

    const proxyHandler: ProxyHandler<User> = {
        set(target: BaseUserType, prop: PropType, newValue) {
            switch(prop) {
                case "address": {
                    if(typeof newValue !== "object") throw new InvalidArgumentError("Invalid address");

                    const address = newValue as AddressType

                    validate(address.block, "Invalid block name", isValidAddress)
                    validate(address.city, "Invalid city name", isValidAddress)
                    validate(address.country, "Invalid country name", isValidAddress)
                    validate(address.province, "Invalid province name", isValidAddress)
                    validate(address.house.toString(), "Invalid house number", isValidHouseNumber)

                    return Reflect.set(target, prop, newValue)
                }
                case "category": {
                    const isValidCategory = Object
                        .values(USER_CATEGORY)
                        .includes(newValue)

                   if(!isValidCategory) throw new InvalidArgumentError("Invalid user's category")

                    return Reflect.set(target, prop, newValue)
                }
                case "document": {
                    if(typeof newValue !== "object") throw new InvalidArgumentError("Invalid first name");

                    const document = newValue as Document;

                    validate(document.type, "Invalid document type", isValidDocumentType)
                    validate(document.issueDate, "Invalid document issue date", isValidDocumentIssueDate)
                    validate(document.number, "Invalid document number", isValidDocumentNumber)

                    if(!isValidDocumentExpireDate(document.expireDate, document.issueDate)) {
                        throw new InvalidArgumentError("Invalid document expire date")
                    }

                    return Reflect.set(target, prop, document)
                }
                case "firstName": {
                   validate(newValue as string, "Invalid first name", isValidName)

                    return Reflect.set(target, prop, newValue)
                }
                case "lastName": {
                    validate(newValue as string, "Invalid last name", isValidName)

                    return Reflect.set(target, prop, newValue)
                }
                case "username": {
                    validate(newValue as string, "Invalid username", isValidUsername)

                    return Reflect.set(target, prop, newValue)
                }
                default: return false 
            }
   
                    
        }
    }

    return new Proxy(target, proxyHandler)
}

