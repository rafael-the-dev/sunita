import { ChangeEvent, useCallback, useContext, useMemo } from "react"
import moment from "moment"

import { DOCUMENT_TYPE } from "@/types/user"

import { UserFormContext } from "../../context"
import { dateFormat } from "@/helpers/date"

import DateInput from "@/components/date"
import Row from "../Row"
import Select from "@/components/shared/combobox"
import Textfield from "@/components/Textfield"

const Document = () => {
    const {
        changeDocumentExpireDate,
        changeDocumentIssueDate,
        changeDocumentNumber,
        changeDocumentType,
        input
    } = useContext(UserFormContext)

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
                <Select 
                    { ...input.document.type }
                    className="mb-0 w-full sm:w-1/2"
                    list={documentsList}
                    label="Type"
                    onChange={documentTypeChangeHandler}
                />
                <Textfield 
                    { ...input.document.number  }
                    className="mb-0 w-full sm:w-1/2"
                    label="Number"
                    onChange={changeDocumentNumber}
                    placeholder="Insert document number"
                    required
                />
            </Row>
            <Row>
                <DateInput 
                    { ...input.document.issueDate }
                    className="mb-0 w-full sm:w-1/2"
                    date
                    label="Issue date"
                    minDate={moment(input.document.issueDate.value).subtract(5, "years").toISOString()}
                    maxDate={moment(new Date(Date.now())).toISOString()}
                    onChange={changeDocumentIssueDate}
                />
                <DateInput 
                    { ...input.document.expireDate }
                    className="mb-0 w-full sm:w-1/2"
                    date
                    label="Expire date"
                    minDate={input.document.issueDate.value}
                    maxDate={moment(input.document.issueDate.value).add(5, "years").toString()}
                    onChange={changeDocumentExpireDate}
                />
            </Row>
        </div>
    )
}

export default Document