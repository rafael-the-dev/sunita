import { ChangeEvent, FormEvent, useCallback, useContext, useMemo, useRef } from "react"
import classNames from "classnames"
import moment from "moment"
import Typography from "@mui/material/Typography"

import styles from "./styles.module.css"

import { DOCUMENT_TYPE } from "@/types/user"

import { BookingContext } from "@/context/BookingContext"
import { AppContext } from "@/context/AppContext"
import { LoginContext } from "@/context/LoginContext"

import useInput from "./hooks/useInput"
import useFetch from "@/hooks/useFetch"

import Alert from "@/components/alert"
import Button from "@/components/shared/button"
import Contact from "@/components/shared/contact"
import Document from "@/components/shared/Document"
import DateInput from "@/components/date"
import Legend from "@/components/shared/Legend"
import Row from "@/components/Form/RegisterUser/components/Row"
import Select from "@/components/shared/combobox"
import Textfield from "@/components/Textfield"

const GuestContainer = () => {

    const { fetchDataRef } = useContext(AppContext)

    const { 
        credentials 
    } = useContext(LoginContext)

    const {
        customerPayload,
        document,
        firstName,
        lastName,

        changeName,
        hasErrors, hasPayload,
        reset,
        toString,

        addPhoneNumber,
        changePhone,
        getAvailableTypes,
        getContact,
        removePhoneNumber,
        
        changeDocumentExpireDate,
        changeDocumentIssueDate,
        changeDocumentNumber,
        changeDocumentType,
    } = useInput()

    const hasError = hasErrors()


    const { loading, fetchData } = useFetch(
        {
            autoFetch: false,
            url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/clients/${hasPayload ? customerPayload.id : ""}`
        }
    )

    const alertProps = useRef(
        {
            description: "",
            severity: "",
            title: ""
        }
    )
    const onCloseAlertRef = useRef<() => void>(null)
    const onOpenAlertRef = useRef<() => void>(null)

    const alertMemo = useMemo(
        () => (
            <Alert 
                { ...alertProps.current }
                className={classNames("mb-6", loading && "")}
                onClose={onCloseAlertRef}
                onOpen={onOpenAlertRef}
            />
        ),
        [ loading ]
    )

    const contactList = useMemo(
        () => (
            <div className="flex flex-col gap-y-4 items-stretch">
                {
                    getContact()
                        .phone
                        .map(contact => (
                            <Contact 
                                { ...contact }
                                key={contact.type.value}
                                list={getAvailableTypes()}
                                onChange={changePhone}
                                onRemove={removePhoneNumber}
                            />
                        ))
                }
            </div>
        ),
        [ changePhone, getAvailableTypes, getContact, removePhoneNumber ]
    )

    const addContactButtonMemo = useMemo(
        () => (
            <Button
                className="py-2"
                onClick={addPhoneNumber}>
                Add contact
            </Button>
        ),
        [ addPhoneNumber ]
    )

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

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(hasError || loading) return;

        onCloseAlertRef.current?.();

        await fetchData(
            {
                options: {
                    body: toString(),
                    method: hasPayload ? "PUT" : "POST"
                },
                onError(e) {
                    alertProps.current = {
                        description: e.message,
                        severity: "error",
                        title: "Error"
                    }
                },
                onSuccess() {
                    alertProps.current = {
                        description: `Client was successfully ${hasPayload ? "updated" : "registered"}`,
                        severity: "success",
                        title: "Success"
                    }

                    fetchDataRef.current?.({})

                    reset()
                }
            }
        );

        onOpenAlertRef.current?.();
    }

    return (
        <form 
            className={classNames(styles.form, `flex flex-col justify-between items-stretch px-3 pt-4 pb-6 sm:px-4`)}
            onSubmit={submitHandler}>
            <div className="flex flex-col gap-y-4">
                { alertMemo }
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
                <fieldset className="flex flex-col gap-y-4">
                    <Legend
                        className="mb-6">
                        Contact
                    </Legend>
                    { contactList }
                    {
                        getAvailableTypes().length > 0 && (
                            <div>
                                { addContactButtonMemo }
                            </div>
                        )
                    }
                </fieldset>
                <fieldset className="flex flex-col gap-y-4 mt-4">
                    <Legend
                        className="mb-6">
                        Document
                    </Legend>
                    <Document 
                        document={document}
                        onChangeExpirationDate={changeDocumentExpireDate}
                        onChangeIssueDate={changeDocumentIssueDate}
                        onChangeNumber={changeDocumentNumber}
                        onChangeType={documentTypeChangeHandler}
                    />
                </fieldset>
            </div>
            <div className="flex flex-col gap-y-4 items-stretch mt-10 sm:flex-row-reverse sm:gap-y-0 sm:gap-x-4">
                <Button
                    disabled={hasError}
                    type="submit">
                    { loading ? "Loading..." : (hasPayload ? "Update" : "Submit") }
                </Button>
                <Button
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    type="button"
                    variant="outlined">
                    Cancel
                </Button>
            </div>
        </form>
    )
}

export default GuestContainer