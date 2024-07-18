import { GuestDBType } from "@/types/guest"

import { Document } from "@/types/user"

import { validate } from "@/validation"
import {
    isValidDocumentExpireDate,
    isValidDocumentIssueDate,
    isValidDocumentNumber,
    isValidDocumentType,
    isValidName,
} from "@/validation/user"

import InvalidArgumentError from "@/errors/server/InvalidArgumentError"

type PropType = "document" | "firstName" | "lastName"

const getGuestProxy = (target: GuestDBType) => {

    const proxyHandler: ProxyHandler<GuestDBType> = {
        set(target: GuestDBType, prop: PropType, newValue) {
            switch(prop) {
                case "document": {
                    if(typeof newValue !== "object") throw new InvalidArgumentError("Invalid document");
                    
                    const document = newValue as Document;

                    validate(document.number, "Invalid document number.", isValidDocumentNumber);
                    validate(document.type, "Invalid document type.", isValidDocumentType);
                    validate(document.issueDate, "Invalid document issue date.", isValidDocumentIssueDate);

                    if(!isValidDocumentExpireDate(document.expireDate, document.issueDate)) {
                        throw new InvalidArgumentError("Invalid document expire date");
                    }

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