import { ContactType } from "@/types/contact";
import { Document } from "@/types/user";

import { isValidPhoneNumber, isValidPhoneType } from "@/validation/contact";
import {
    isValidDocumentExpireDate,
    isValidDocumentIssueDate,
    isValidDocumentNumber,
    isValidDocumentType,
} from "@/validation/user"
import { validate } from "@/validation";

import InvalidArgumentError from "@/errors/server/InvalidArgumentError";

export const validateContact = (contact: ContactType) => {
    if(!contact || typeof contact !== "object") throw new InvalidArgumentError("Invalid contact.");

    contact
        .phone
        .forEach(phone => {
            validate(phone.type, `Invalid contact type: '${phone.type}'`, isValidPhoneType)
            validate(phone.number, `Contact of type '${phone.type}' is invalid`, isValidPhoneNumber)
        })
}

export const validateDocument = (document: Document) => {
    if(!document || typeof document !== "object") throw new InvalidArgumentError("Invalid document");

    validate(document.number, "Invalid document number.", isValidDocumentNumber);
    validate(document.type, "Invalid document type.", isValidDocumentType);
    validate(document.issueDate, "Invalid document issue date.", isValidDocumentIssueDate);

    if(!isValidDocumentExpireDate(document.expireDate, document.issueDate)) {
        throw new InvalidArgumentError("Invalid document expire date");
    }
}