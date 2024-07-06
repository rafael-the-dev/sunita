import { ChangeEvent, FormEvent, ReactNode, useCallback, useEffect, useRef, useState } from "react"
import classNames from "classnames"
import Typography from "@mui/material/Typography"

import styles from "./styles.module.css"

import { DOCUMENT_TYPE, USER_CATEGORY } from "@/types/user"

import useFetch from "@/hooks/useFetch"

import Address from "./components/Address"
import BaseDetails from "./components/BaseDetails"
import Document from "./components/Document"
import Alert from "@/components/alert"
import Button from "@/components/shared/button"
import DateInput from "@/components/date"
import Form from ".."
import Select from "@/components/shared/combobox"
import Textfield from "@/components/Textfield"
import useForm from "./hooks/useForm"
import Stepper from "@/components/stepper"
import { UserFormContextProvider } from "./context"

type PropsType = {
    url: string
};

const Legend = ({ children }: { children: ReactNode }) => (
    <Typography
        className="font-semibold mb-4 text-lg"
        component="legend">
        { children }
    </Typography>
)

const Row = ({ children }: { children: ReactNode }) => (
    <div className="flex flex-wrap gap-y-4 sm:flex-nowrap sm:gap-y-0 sm:gap-x-4">
        { children }
    </div>
);

const UserForm = ({ url }: PropsType) => {
    const { 
        hasErrors,
        input, 
        changeDocumentNumber,
        changeDocumentType,
        changeName,
        changePostition,
        changeUsername
    } = useForm();

    const { fetchData, loading  } = useFetch({
        autoFetch: false,
        url
    });

    const alertProps = useRef({
        description: "User was successfully registered",
        severity: "success",
        title: "Success"
    });

    const onCloseAlert = useRef<() => void>(null);
    const onOpenAlert = useRef<() => void>(null);

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        fetchData({
            options: {
                body: JSON.stringify({}),
                method: "POST"
            }
        });
    }

    useEffect(() => {
        onOpenAlert.current?.()
    }, []);

    return (
        <Form 
            className={classNames(styles.form, `box-border flex flex-col justify-between`)}
            onSubmit={submitHandler}>
            <Stepper 
                className={styles.stepper}
                components={[ <BaseDetails key={0} />, <Document key={1} />, <Address key={2} /> ]}
                steps={[ "Base details", "Document", "Address" ]}
            />
        </Form>
    )
}

const UserFormProvider = ({ url }: PropsType) => (
    <UserFormContextProvider>
        <UserForm url={url} />
    </UserFormContextProvider>
)

export default UserFormProvider

/**
 * <div className="flex flex-col gap-y-4">
                <fieldset className="flex flex-col gap-y-4">
                    <Legend>Base details</Legend>
                    <Row>
                        <Textfield 
                            { ...input.firstName }
                            className="mb-0 w-full sm:w-1/2"
                            label="First name"
                            onChange={changeName("firstName")}
                            placeholder="Insert first name"
                            required
                        />
                        <Textfield 
                            { ...input.lastName }
                            className="mb-0 w-full sm:w-1/2"
                            label="Last name"
                            onChange={changeName("lastName")}
                            placeholder="Insert last name"
                            required
                        />
                    </Row>
                    <Row>
                        <Textfield 
                            { ...input.username }
                            className="mb-0 w-full sm:w-1/2"
                            label="Username"
                            onChange={changeUsername}
                            placeholder="Example: rafael_tivane"
                            required
                        />
                        <Select 
                            { ...input.position }
                            className="mb-0 w-full sm:w-1/2"
                            list={usersPositions}
                            label="Position"
                            onChange={usersPositionsChangeHandler}
                        />
                    </Row>
                </fieldset>
                <fieldset className="flex flex-col gap-y-4">
                    <Legend>Document</Legend>
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
                            className="mb-0 w-full sm:w-1/2"
                            label="Issue date"
                            onChange={() => {}}
                            value={new Date(Date.now()).toString()}
                        />
                        <DateInput 
                            className="mb-0 w-full sm:w-1/2"
                            label="Expire date"
                            onChange={() => {}}
                            value={new Date(Date.now()).toString()}
                        />
                    </Row>
                </fieldset>
            </div>
            <div className="flex justify-end mt-8">
                <Button 
                    className="py-2"
                    disabled={loading || hasErrors}>
                    { loading ? "Loading..." : "Submit" }
                </Button>
            </div>
 */