import { ChangeEvent, useCallback, useContext, useMemo } from "react"
import moment from "moment"
import Typography from "@mui/material/Typography"

import { DOCUMENT_TYPE } from "@/types/user"

import { BookingContext } from "@/context/BookingContext"

import DateInput from "@/components/date"
import Row from "@/components/Form/RegisterUser/components/Row"
import Select from "@/components/shared/combobox"
import Textfield from "@/components/Textfield"

const GuestContainer = () => {
    const { 
        changeDocumentExpireDate,
        changeDocumentIssueDate,
        changeDocumentNumber,
        changeDocumentType,
        changeName,
        guest 

    } = useContext(BookingContext)

    const documentsList = useMemo(
        () => Object
            .values(DOCUMENT_TYPE)
            .map(value => ({ label: value, value })),
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
                <Typography
                    component="legend"
                    className="font-semibold mb-6">
                    Document
                </Typography>
                <Row>
                    <Select 
                        { ...guest.document.type }
                        className="mb-0 w-full sm:w-1/2"
                        list={documentsList}
                        label="Type"
                        onChange={documentTypeChangeHandler}
                    />
                    <Textfield 
                        { ...guest.document.number  }
                        className="mb-0 w-full sm:w-1/2"
                        label="Number"
                        onChange={changeDocumentNumber}
                        placeholder="Insert document number"
                        required
                    />
                </Row>
                <Row>
                    <DateInput 
                        { ...guest.document.issueDate }
                        className="mb-0 w-full sm:w-1/2"
                        date
                        label="Issue date"
                        minDate={moment(guest.document.issueDate.value).subtract(5, "years").toISOString()}
                        maxDate={moment(new Date(Date.now())).toISOString()}
                        onChange={changeDocumentIssueDate}
                    />
                    <DateInput 
                        { ...guest.document.expireDate }
                        className="mb-0 w-full sm:w-1/2"
                        date
                        label="Expire date"
                        minDate={guest.document.issueDate.value}
                        maxDate={moment(guest.document.issueDate.value).add(5, "years").toString()}
                        onChange={changeDocumentExpireDate}
                    />
                </Row>
            </fieldset>
        </div>
    )
}

export default GuestContainer