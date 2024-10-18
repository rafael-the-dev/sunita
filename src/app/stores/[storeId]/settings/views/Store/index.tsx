import * as React from "react"
import classNames from "classnames"

import {LANGUAGE} from "@/types/language"

import { FormContext, FormContextProvider } from "@/app/system/stores/views/store-components/Form/context"
import { SettingsContext } from "../../context"

import lang from "@/lang/index.json"

import useLanguage from "@/hooks/useLanguage"

import Alert from "@/components/alert"
import Address from "@/components/Container/Address"
import Button from "@/components/shared/button"
import Contact from "@/components/Container/Contact"
import Legend from "@/components/shared/Legend"
import Textfield from "@/components/Textfield"

const StoreView = () => {
    const { store } = React.useContext(SettingsContext)

    const { 
        address,
        contact, 
        hasErrors,
        name,
        nameChangeHandler,
        toLiteralObject
    } = React.useContext(FormContext)

    const { language, translate } = useLanguage()

    const hasError = hasErrors()
    const loading = store.loading

    const alertProps = React.useRef({
        description: "",
        severity: "",
        title: ""
    })

    const onClose = React.useRef<() => void>(null);
    const onOpen = React.useRef<() => void>(null);

    const alert = React.useMemo(
        () => (
            <Alert 
                { ...alertProps.current }
                className={classNames("mb-6", loading)}
                onClose={onClose}
                onOpen={onOpen}
            />
        ), 
        [ loading ]
    )

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(hasError || loading) return;

        onClose.current?.();

        await store.fetchData(
            {
                options: {
                    body: JSON.stringify(toLiteralObject()),
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
                    alertProps.current = {
                        description: translate({ [LANGUAGE.ENGLISH]: "Store was successfully updated", [LANGUAGE.PORTUGUESE]: "Atualizado com successo" }),
                        severity: "success",
                        title: "Success"
                    }

                    await store.fetchData({})
                },
                path: `/api/stores/${store.data?.data?.id}`
            }
        );

        onOpen.current?.();
    }

    return (
        <form 
            className="flex flex-col h-full justify-between px-2 md:mb-4 md:px-4 md:pb-0"
            onSubmit={submitHandler}>
            <div className="flex flex-col items-stretch grow gap-y-4">
                { alert }
                <Textfield 
                    { ...name }
                    className={classNames("mb-0 w-full")}
                    label={ translate({ [LANGUAGE.ENGLISH]: "Name", [LANGUAGE.PORTUGUESE]: "Nome" })}
                    onChange={nameChangeHandler}
                    placeholder={ translate({ [LANGUAGE.ENGLISH]: "Insert the name", [LANGUAGE.PORTUGUESE]: "Insere o nome" })}
                />
                <fieldset className="flex flex-col gap-y-4 mt-6">
                    <Legend
                        className="mb-6">
                        { lang["contact"][language]}
                    </Legend>
                    <div className="flex flex-col gap-y-4">
                        <Contact 
                            contact={contact.getContact()}
                            onAddContact={contact.addPhoneNumber}
                            onChange={contact.changePhone}
                            onRemove={contact.removePhoneNumber}
                        />
                    </div>
                </fieldset>
                <fieldset className="flex flex-col gap-y-4 mt-6">
                    <Legend
                        className="mb-6">
                        { lang["address"][language]}
                    </Legend>
                    <Address { ...address } hasCords onLocationFound={address.setCords} />
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
    const { store } = React.useContext(SettingsContext)
    
    if(!store.data?.data) return <></>

    return (
        <FormContextProvider
            baseTest
            initialAddress={ store.data?.data?.address}
            initialContact={store.data?.data?.contact}
            initialId={ store.data?.data?.id }
            initialName={store.data?.data?.name}
            initialStatus={store.data?.data?.status}>
            <StoreView />
        </FormContextProvider>
    )
}

export default Provider