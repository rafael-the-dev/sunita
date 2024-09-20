
import { AddressType } from "@/types/address";

import { isValidCountry, isValidCity, isValidNumber, isValidState, isValidStreet} from "@/validation/address"
import { validate } from "@/validation";
import { validateObject } from "../../db/validation";

export const validateAddress = (address: AddressType) => {
    //throw an error, If address is not an object
    validateObject("address", address);

    validate(address.city, "Invalid city name", isValidCity)
    validate(address.country, "Invalid country name", isValidCountry)
    validate(address.number?.toString(), "Invalid property number", isValidNumber)
    validate(address.state, "Invalid state/province name", isValidState)
    validate(address.street, "Invalid street address", isValidStreet)
}