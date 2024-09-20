import { ChangeEvent } from "react"

import { DOCUMENT_TYPE, Document } from "@/types/user"

import { initial } from "./values"

export type DocumentInputType = typeof initial

export type DocumentInputFunctions = {
    changeDocumentExpireDate: (newDate: string) => void,
    changeDocumentIssueDate: (newDate: string) => void,
    changeDocumentType: (documentType: DOCUMENT_TYPE) => void,
    changeDocumentNumber: (e: ChangeEvent<HTMLInputElement>) => void,
    getDocument: () => DocumentInputType,
    resetDocument: () => void,
    hasErrors: () => boolean,
    toLiteralObject: (e: ChangeEvent<HTMLInputElement>) => Document
}