import { ChangeEvent } from "react"
import moment from "moment"

import { DOCUMENT_TYPE } from "@/types/user"
import { DocumentInputType } from "@/hooks/useDocument/types"

import DateInput from "@/components/date"
import Row from "@/components/Form/RegisterUser/components/Row"
import Select from "@/components/shared/combobox"
import Textfield from "@/components/Textfield"

type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;
type DateChangeHandler = (datee: string) => void;

type PropsType = {
    document: DocumentInputType,
    onChangeExpirationDate: DateChangeHandler,
    onChangeIssueDate: DateChangeHandler,
    onChangeNumber: ChangeHandler,
    onChangeType: ChangeHandler
}

const documentsList = Object
        .values(DOCUMENT_TYPE)
        .map(value => ({ label: value, value }))

const Document = (props: PropsType) => {
    const {
        document,
        onChangeExpirationDate,
        onChangeIssueDate,
        onChangeNumber,
        onChangeType
    } = props

   
    return (
        <>
            <Row>
                <Select 
                    { ...document.type }
                    className="mb-0 w-full sm:w-1/2"
                    list={documentsList}
                    label="Type"
                    onChange={onChangeType}
                />
                <Textfield 
                    { ...document.number  }
                    className="mb-0 w-full sm:w-1/2"
                    label="Number"
                    onChange={onChangeNumber}
                    placeholder="Insert document number"
                    required
                />
            </Row>
            <Row>
                <DateInput 
                    { ...document.issueDate }
                    className="mb-0 w-full sm:w-1/2"
                    date
                    label="Issue date"
                    minDate={moment(document.issueDate.value).subtract(5, "years").toISOString()}
                    maxDate={moment(new Date(Date.now())).toISOString()}
                    onChange={onChangeIssueDate}
                />
                <DateInput 
                    { ...document.expireDate }
                    className="mb-0 w-full sm:w-1/2"
                    date
                    label="Expire date"
                    minDate={document.issueDate.value}
                    maxDate={moment(document.issueDate.value).add(5, "years").toString()}
                    onChange={onChangeExpirationDate}
                />
            </Row>
        </>
    )
}

export default Document