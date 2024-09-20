
import InvalidArgumentError from "@/errors/server/InvalidArgumentError"
import { BaseUserType, USER_CATEGORY, User } from "@/types/user"

import { validateAddress } from "@/models/server/proxy/validation";
import { validateContact, validateDocument } from "../validation/user";
import { isValidName, isValidUsername } from "@/validation/user"
import { validate } from "@/validation";

type PropType = "address" | "category" | "contact" | "document" | "firstName" | "lastName" | "password" | "username"

export const getUserProxy = (target: User) => {

    const proxyHandler: ProxyHandler<User> = {
        set(target: BaseUserType, prop: PropType, newValue) {
            switch(prop) {
                case "address": {
                    //throw an error, If address is not a valid object
                    validateAddress(newValue)

                    return Reflect.set(target, prop, newValue)
                }
                case "category": {
                    const isValidCategory = Object
                        .values(USER_CATEGORY)
                        .includes(newValue)

                   if(!isValidCategory) throw new InvalidArgumentError("Invalid user's category")

                    return Reflect.set(target, prop, newValue)
                }
                case "contact": {
                    //throw an error, If contact is invalid
                    validateContact(newValue)

                    return Reflect.set(target, prop, newValue)
                }
                case "document": {
                    //throw an error, If document is invalid
                    validateDocument(newValue)

                    return Reflect.set(target, prop, newValue)
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

