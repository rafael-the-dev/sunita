import { ChangeEvent, useCallback, useContext, useMemo } from "react"
import moment from "moment"
import Typography from "@mui/material/Typography"

import { DOCUMENT_TYPE } from "@/types/user"

import { BookingContext } from "@/context/BookingContext"

import ContactList from "@/components/shared/ContactList"
import Document from "@/components/shared/Document"
import DateInput from "@/components/date"
import Legend from "@/components/shared/Legend"
import Row from "@/components/Form/RegisterUser/components/Row"
import Select from "@/components/shared/combobox"
import Textfield from "@/components/Textfield"

const GuestContainer = () => {
    const { 
        addPhoneNumber,
        changePhone,
        changeDocumentExpireDate,
        changeDocumentIssueDate,
        changeDocumentNumber,
        changeDocumentType,
        changeName,
        guest,
        getAvailableTypes,
        removePhoneNumber

    } = useContext(BookingContext)

    const contact = guest.contact

    const documentsList = useMemo(
        () => Object
            .values(DOCUMENT_TYPE)
            .map(value => ({ label: value, value })),
        []
    )

    const contactLegend = useMemo(
        () => (
            <Legend>
                Contact
            </Legend>
        ),
        []
    )

    const contactList = useMemo(
        () => (
            <ContactList
                addPhoneNumber={addPhoneNumber}
                contact={contact}
                changePhone={changePhone}
                getAvailableTypes={getAvailableTypes}
                hasErrors={null}
                removePhoneNumber={removePhoneNumber}
                resetContact={null}
            />
        ),
        [ addPhoneNumber, contact, changePhone, getAvailableTypes, removePhoneNumber ]
    )

    const documentLegend = useMemo(
        () => (
            <Legend>
                Document
            </Legend>
        ),
        []
    )

    const documentTypeChangeHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => changeDocumentType(e.target.value as DOCUMENT_TYPE),
        [ changeDocumentType ]
    );

    return (
        <div className="flex flex-col gap-y-4">
            <Row>
                <Textfield 
                    { ...guest.firstName}
                    className="mb-0 w-full sm:w-1/2"
                    label="First name"
                    onChange={changeName("first")}
                />
                <Textfield 
                    { ...guest.lastName }
                    className="mb-0 w-full sm:w-1/2"
                    label="Last name"
                    onChange={changeName("last")}
                />
            </Row>
            <fieldset className="flex flex-col gap-y-4">
                { contactLegend }
                { contactList }
            </fieldset>
            <fieldset className="flex flex-col gap-y-4">
                { documentLegend }
                <Document 
                    document={guest.document}
                    onChangeExpirationDate={changeDocumentExpireDate}
                    onChangeIssueDate={changeDocumentIssueDate}
                    onChangeNumber={changeDocumentNumber}
                    onChangeType={documentTypeChangeHandler}
                />
            </fieldset>
        </div>
    )
}

export default GuestContainer