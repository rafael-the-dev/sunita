import moment from "moment";

import { DOCUMENT_TYPE } from "@/types/user";

export const isValidDocumentNumber = (number: string) => {
    const pattern = /^[A-Za-z0-9]{5,}(-?[A-Za-z0-9]+)*$/;

    return pattern.test(number);
};

export const isValidDocumentType = (documentType: DOCUMENT_TYPE) => {
    return  Object
        .values(DOCUMENT_TYPE)
        .includes(documentType)
}

export const isValidDocumentIssueDate = (date: string | Date) => {
    const issueDate = moment(date);
    const currentDate = moment(new Date(Date.now()));

    if(issueDate.isAfter(currentDate)) return false;

    return true
}

export const isValidDocumentExpireDate = (date: string | Date, issueDate: string | Date) => {
    const expireDate = moment(date);
    const currentDate = moment(new Date(Date.now()));
    //const momentExpIreDate = moment(issueDate).add(5, "years")

    const isBeforeIssueDate = expireDate.isBefore(moment(issueDate))
    const isBeforeCurrentDate = expireDate.isBefore(currentDate)

    if(isBeforeCurrentDate || isBeforeIssueDate) return false;

    return true
}

export const isValidName = (name: string) => {
    const pattern = /^[A-Za-z]{2,}(?:\s[A-Za-z]{2,})*$/;

    return pattern.test(name);
};

export const isValidPassword = (password: string) => {
    const pattern = /^[A-Z]{1}[A-Za-z0-9$@%]{7,}$/

    return pattern.test(password)
}

export const isValidUsername = (name: string) => {
    const pattern = /^[A-Za-z]{2,}([A-Za-z0-9_])*$/;

    return pattern.test(name);
};