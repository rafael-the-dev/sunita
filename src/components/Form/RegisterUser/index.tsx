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