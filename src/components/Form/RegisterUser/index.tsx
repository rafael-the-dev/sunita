import { FormEvent, MutableRefObject, useContext, useMemo, useRef } from "react"
import classNames from "classnames"

import styles from "./styles.module.css"

import { UsersContext } from "@/context/UsersContext"
import { UserFormContext } from "./context"
import useFetch from "@/hooks/useFetch"

import Button from "@/components/shared/button"
import Address from "./components/Address"
import BaseDetails from "./components/BaseDetails"
import Document from "./components/Document"
import Alert from "@/components/alert"
import Form from ".."
import Stepper from "@/components/stepper"
import { UserFormContextProvider } from "./context"

type PropsType = {
    refetchUsers?: () => Promise<void> | void,
    url: string
};

const UserForm = ({ refetchUsers, url }: PropsType) => {
    const { hasErrors, resetForm, toString } = useContext(UserFormContext)
    
    const { fetchData, loading  } = useFetch({
        autoFetch: false,
        url
    });

    const alertProps = useRef({
        description: "",
        severity: "",
        title: ""
    });

    const onCloseAlert = useRef<() => void>(null);
    const onOpenAlert = useRef<() => void>(null);
    const resetStepperHandlerRef = useRef<() => void>(null)

    const alertMemo = useMemo(
        () => (
            <Alert 
                { ...alertProps.current }
                className={classNames("mb-6", { "": loading })}
                onClose={onCloseAlert}
                onOpen={onOpenAlert}
            />
        ),
        [ loading ]
    )

    console.log(refetchUsers)

    const submitHandler = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if(hasErrors()) return;

        onCloseAlert.current?.()
        
        await fetchData({
            options: {
                body: toString(),
                method: "POST"
            },
            onError(error) {
                alertProps.current = {
                    description: error.message,
                    severity: "error",
                    title: "Error"
                }
            },
            async onSuccess() {
                alertProps.current = {
                    description: "User was successfully registered",
                    severity: "success",
                    title: "Success"
                }

                refetchUsers && await refetchUsers()

                resetForm()

                resetStepperHandlerRef.current?.()
            },
        });

        onOpenAlert.current?.()
    }

    return (
        <Form 
            className={classNames(styles.form, `box-border flex flex-col justify-between`)}>
            { alertMemo }
            <Stepper 
                className={styles.stepper}
                components={[ <BaseDetails key={0} />, <Document key={1} />, <Address key={2} /> ]}
                steps={[ "Base details", "Document", "Address" ]}
                FinishButton={() => (
                    <Button 
                        className="py-2 px-4"
                        disabled={hasErrors()}
                        onClick={submitHandler}
                        type="button"
                    >
                        { loading ? "Loading..." : "Submit" }
                    </Button>
                )}
                resetStepperRef={resetStepperHandlerRef}
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