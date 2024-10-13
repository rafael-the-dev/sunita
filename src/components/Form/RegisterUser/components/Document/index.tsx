import { ChangeEvent, useCallback, useContext, useMemo } from "react"
import moment from "moment"

import { DOCUMENT_TYPE } from "@/types/user"

import lang from "@/lang/document.json"

import { UserFormContext } from "../../context"

import useLanguage from "@/hooks/useLanguage"

import DateInput from "@/components/date"
import Row from "../Row"
import Select from "@/components/shared/combobox"
import Textfield from "@/components/Textfield"

const Document = () => {
    const {
        document: {
            changeDocumentExpireDate,
            changeDocumentIssueDate,
            changeDocumentNumber,
            changeDocumentType,
            getDocument
        }
    } = useContext(UserFormContext)

    const { language } = useLanguage()

    const document = getDocument()

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
                    { ...document.type }
                    className="mb-0 w-full sm:w-1/2"
                    list={documentsList}
                    label={ lang["type"]["label"][language] }
                    onChange={documentTypeChangeHandler}
                />
                <Textfield 
                    { ...document.number  }
                    className="mb-0 w-full sm:w-1/2"
                    label={ lang["number"]["label"][language] }
                    onChange={changeDocumentNumber}
                    placeholder={ lang["number"]["placeholder"][language] }
                    required
                />
            </Row>
            <Row>
                <DateInput 
                    { ...document.issueDate }
                    className="mb-0 w-full sm:w-1/2"
                    date
                    label={ lang["issueDate"]["label"][language] }
                    minDate={moment(document.issueDate.value).subtract(5, "years").toISOString()}
                    maxDate={moment(new Date(Date.now())).toISOString()}
                    onChange={changeDocumentIssueDate} 
                />
                <DateInput 
                    { ...document.expireDate }
                    className="mb-0 w-full sm:w-1/2"
                    date
                    label={ lang["expireDate"]["label"][language] }
                    minDate={document.issueDate.value}
                    maxDate={moment(document.issueDate.value).add(5, "years").toString()}
                    onChange={changeDocumentExpireDate}
                />
            </Row>
        </div>
    )
}

export default Document