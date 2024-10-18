import * as React from "react"
import classNames from "classnames"

import { UserFormContext, UserFormContextProvider } from "@/components/Form/RegisterUser/context"
import { SettingsContext } from "../../context"

import { LANGUAGE } from "@/types/language"

import lang from "@/lang/index.json"

import useLanguage from "@/hooks/useLanguage"

import Alert from "@/components/alert"
import Address from "@/components/Form/RegisterUser/components/Address"
import BaseDetails from "@/components/Form/RegisterUser/components/BaseDetails"
import Button from "@/components/shared/button"
import Document from "@/components/Form/RegisterUser/components/Document"
import Legend from "@/components/shared/Legend"

const ProfileView = () => {
    const { hasErrors, resetForm, toString } = React.useContext(UserFormContext)
    const { profile: { fetchData, loading } } = React.useContext(SettingsContext)

    const { language } = useLanguage()

    const alertProps = React.useRef({
        description: "",
        severity: "",
        title: ""
    });

    const onCloseAlert = React.useRef<() => void>(null);
    const onOpenAlert = React.useRef<() => void>(null);

    const hasError = hasErrors()

    const isEnglish = language === LANGUAGE.ENGLISH

    const alert = React.useMemo(
        () => (
            <Alert 
                { ...alertProps.current }
                className={classNames("mb-6", loading)}
                onClose={onCloseAlert}
                onOpen={onOpenAlert}
            />
        ), 
        [ loading ]
    )


    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(hasError || loading) return;

        onCloseAlert.current?.()
        
        await fetchData({
            options: {
                body: toString(),
                method: "PUT"
            },
            onError(error) {
                alertProps.current = {
                    description: error.message,
                    severity: "error",
                    title: "Error"
                }
            },
            async onSuccess() {
                const description = isEnglish ? "User was successfully updated" : "Usuario atualizado com successo"

                alertProps.current = {
                    description,
                    severity: "success",
                    title: "Success"
                }

                await fetchData({})

                resetForm()
            },
        });

        onOpenAlert.current?.()
    }


    return (
        <form 
            className="flex flex-col h-full justify-between px-2 md:mb-4 md:px-4 md:pb-0"
            onSubmit={submitHandler}>
            <div className="flex flex-col items-stretch grow gap-y-4">
                { alert }
                <BaseDetails />
                <fieldset className="mt-2">
                    <Legend>
                        { lang["document"][language]}
                    </Legend>
                    <Document />
                </fieldset>
                <fieldset className="mt-2">
                    <Legend>
                        { lang["address"][language]}
                    </Legend>
                    <Address />
                </fieldset>
            </div>
            <div className="flex mt-8 sm:justify-end">
                <Button
                    className="py-2 w-full sm:w-fit"
                    disabled={ hasError || loading }
                    type="submit">
                    { loading ? "Loading..." : lang["buttons"]["update"][language] }
                </Button>
            </div>
        </form>
    )
}

const Provider = () => {
    const { profile } = React.useContext(SettingsContext)
    
    //if(!store.data?.data) return <></>

    return (
        <UserFormContextProvider>
            <ProfileView />
        </UserFormContextProvider>
    )
}

export default Provider