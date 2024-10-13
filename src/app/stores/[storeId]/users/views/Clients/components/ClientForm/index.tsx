import { ChangeEvent, FormEvent, useCallback, useContext, useMemo, useRef } from "react"
import classNames from "classnames"
import moment from "moment"
import Typography from "@mui/material/Typography"

import styles from "./styles.module.css"

import { DOCUMENT_TYPE } from "@/types/user"

import { BookingContext } from "@/context/BookingContext"
import { AppContext } from "@/context/AppContext"
import { LoginContext } from "@/context/LoginContext"

import contactLang from "@/lang/contact.json"
import lang from "@/lang/index.json"
import userLang from "@/lang/user.json"

import useInput from "./hooks/useInput"
import useFetch from "@/hooks/useFetch"
import useLanguage from "@/hooks/useLanguage"

import Alert from "@/components/alert"
import Button from "@/components/shared/button"
import ContactList from "@/components/shared/ContactList"
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

    const { language } = useLanguage()

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
            <ContactList
                addPhoneNumber={addPhoneNumber}
                contact={getContact()}
                changePhone={changePhone}
                getAvailableTypes={getAvailableTypes}
                hasErrors={null}
                removePhoneNumber={removePhoneNumber}
                resetContact={null}
            />
        ),
        [ addPhoneNumber, changePhone, getAvailableTypes, getContact, removePhoneNumber ]
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
                    const description = hasPayload ? `Client was successfully ${hasPayload ? "updated" : "registered"}` : 
                    `Client foi ${ hasPayload ? "atualizado" : "registado" }  com success`

                    alertProps.current = {
                        description,
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
                        label={ userLang["firstName"]["label"][language] }
                        onChange={changeName("firstName")}
                    />
                    <Textfield 
                        { ...lastName }
                        className="mb-0 w-full sm:w-1/2"
                        label={ userLang["lastName"]["label"][language] }
                        onChange={changeName("lastName")}
                    />
                </Row>
                <fieldset className="flex flex-col gap-y-4">
                    <Legend
                        className="mb-6">
                        { lang["contact"][language] }
                    </Legend>
                    { contactList }
                </fieldset>
                <fieldset className="flex flex-col gap-y-4 mt-4">
                    <Legend
                        className="mb-6">
                        { lang["document"][language] }
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
                    { loading ? "Loading..." : (hasPayload ? lang["buttons"]["update"][language] : lang["buttons"]["submit"][language]) }
                </Button>
                <Button
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    type="button"
                    variant="outlined">
                    { lang["buttons"]["cancel"][language] }
                </Button>
            </div>
        </form>
    )
}

export default GuestContainer