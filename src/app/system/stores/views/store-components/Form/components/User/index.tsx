import { ChangeEvent, useCallback, useContext } from "react"

import { DOCUMENT_TYPE } from "@/types/user"

import { FormContext } from "../../context"

import Address from "@/components/Container/Address"
import Contact from "@/components/Container/Contact"
import Document from "@/components/shared/Document"
import Legend from "@/components/shared/Legend"
import Row from "@/components/Form/RegisterUser/components/Row"
import Textfield from "@/components/Textfield"

const UsersContainer = () => {
    const { 
        user: {
            address,
            contact,
            changeName,
            document,
            firstName,
            lastName
        } 
    } = useContext(FormContext)

    const changeDocumentType = document.changeDocumentType

    const documentTypeChangeHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => changeDocumentType(e.target.value as DOCUMENT_TYPE),
        [ changeDocumentType ]
    )

    return (
        <div>
            <Row>
                <Textfield 
                    { ...firstName}
                    className="mb-0 w-full sm:w-1/2"
                    label="First name"
                    onChange={changeName("firstName")}
                />
                <Textfield 
                    { ...lastName }
                    className="mb-0 w-full sm:w-1/2"
                    label="Last name"
                    onChange={changeName("lastName")}
                />
            </Row>
            <fieldset className="flex flex-col gap-y-4 mt-6">
                <Legend
                    className="mb-6">
                    Contact
                </Legend>
                <Contact
                    contact={contact.getContact()}
                    //@ts-ignore
                    getAvailableTypes={contact.getAvailableTypes}
                    hasErrors={null}
                    onAddContact={contact.addPhoneNumber}
                    onChange={contact.changePhone}
                    onRemove={contact.removePhoneNumber}
                    resetContact={null}
                />
            </fieldset>
            <fieldset className="flex flex-col gap-y-4 mt-6">
                <Legend
                    className="mb-6">
                    Document
                </Legend>
                <Document 
                    document={document.getDocument()}
                    onChangeExpirationDate={document.changeDocumentExpireDate}
                    onChangeIssueDate={document.changeDocumentIssueDate}
                    onChangeNumber={document.changeDocumentNumber}
                    onChangeType={documentTypeChangeHandler}
                />
            </fieldset>
            <fieldset className="flex flex-col gap-y-4 mt-6">
                <Legend
                    className="mb-6">
                    Address
                </Legend>
                <Address { ...address } />
            </fieldset>
        </div>
    )
}

export default UsersContainer