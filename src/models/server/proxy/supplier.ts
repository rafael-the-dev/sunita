
import InvalidArgumentError from "@/errors/server/InvalidArgumentError"
import { SupplierAddressType, SupplierType } from "@/types/Supplier"
import { ContactType } from "@/types/contact"

import { validate } from "@/validation"
import { isValidAddress } from "@/validation/user"
import { isValidPhoneNumber, isValidPhoneType } from "@/validation/contact"
import { isValidNUIT } from "@/validation/document"
import { isValidName } from "@/validation/user"
import { isValidAddressNumber } from "@/validation/address"

type PropsType = "address" | "contact" | "name" | "nuit"

const getSupplierProxy = (target: SupplierType) => {
    const proxyHandler: ProxyHandler<SupplierType> = {
        set(target: SupplierType, prop: PropsType, newValue) {
            switch(prop) {
                case "address": {
                    const address = newValue as SupplierAddressType

                    if(!address) throw new InvalidArgumentError("Invalid address");

                    validate(address.country, "Invalid country name", isValidAddress);
                    validate(address.province, "Invalid province name", isValidAddress);
                    validate(address.city, "Invalid city name", isValidAddress);
                    validate(address.street, "Invalid street name", isValidAddress);
                    validate(address.number?.toString(), "Invalid address number", isValidAddressNumber);

                    return Reflect.set(target, prop, newValue);
                }
                case "contact": {
                    const contact = newValue as ContactType;

                    if(!contact) throw new InvalidArgumentError("Invalid contact");

                    if(!Array.isArray(contact.phone)) throw new InvalidArgumentError("Invalid phone list");

                    contact
                        .phone
                        .forEach(phone => {
                            validate(phone.number, "Invalid contact number", isValidPhoneNumber);
                            validate(phone.type, "Invalid contact type", isValidPhoneType);
                        })


                    return Reflect.set(target, prop, newValue);
                }
                case "name": {
                    validate(newValue, "Invalid supplier's name", isValidName);

                    return Reflect.set(target, prop, newValue);
                }
                case "nuit": {
                    validate(newValue, "Invalid NUIT number", isValidNUIT);

                    return Reflect.set(target, prop, newValue);
                }
            }

        }
    }

    return new Proxy(target, proxyHandler)
}

export default getSupplierProxy