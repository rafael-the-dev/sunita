import * as React from "react"
import classNames from "classnames"
import currency from "currency.js"
import Typography from "@mui/material/Typography"

import styles from "./styles.module.css"

import { LoginContext } from "@/context/LoginContext"
import { ProductsPageContext } from "../../../../context"
import { FixedTabsContext } from "@/context/FixedTabsContext"

import { SupplierType } from "@/types/Supplier"

import useContact from "@/hooks/useContact"
import useForm from "./hooks/useForm"
import useFetch from "@/hooks/useFetch"

import Alert from "@/components/alert"
import Button from "@/components/shared/button"
import Contact from "@/components/shared/contact"
import Row from "@/components/Form/RegisterUser/components/Row"
import TextField from "@/components/Textfield"

const Form = () => {
    const { credentials } = React.useContext(LoginContext)
    const { suppliers } = React.useContext(ProductsPageContext)
    const { getDialog, setDialog } = React.useContext(FixedTabsContext)

    const supplierPayload = getDialog().current?.payload as SupplierType;
    const hasSupplier = Boolean(supplierPayload);

    const {
        addPhoneNumber,
        changePhone,
        getAvailableTypes,
        getContact,
        removePhoneNumber,
        resetContact,
        ...contactRest
    } = useContact(supplierPayload?.contact)

    const { 
        changeAddressHandler, 
        changeAddressNumberHandler,
        changeNameHandler, 
        changeNUITHandler, 
        changeAddressStreetHandler,
        getInput,
        resetForm,
        ...formRest
    } = useForm()


    const hasErrors = contactRest.hasErrors || formRest.hasErrors;

    const { fetchData, loading } = useFetch(
        {
            autoFetch: false,
            url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/products/suppliers/${ hasSupplier ? supplierPayload.id : ""}`
        }
    );

    const alertProps = React.useRef({
        description: "Supplier was successfully registered",
        severity: "success",
        title: "Success"
    })

    const onCloseFuncRef = React.useRef<() => void>(null)
    const onOpenFuncRef = React.useRef<() => void>(null)

    const alertMemo = React.useMemo(
        () => (
            <Alert 
                { ...alertProps.current }
                className={classNames(loading && "", `mb-6
                    `)}
                onClose={onCloseFuncRef}
                onOpen={onOpenFuncRef}
            />
        ),
        [ loading ]
    )

    const contactListMemo = React.useMemo(
        () => {
            return getContact()
                .phone
                .map(phone => (
                    <Contact 
                        { ...phone }
                        key={phone.type.value}
                        list={getAvailableTypes()}
                        onChange={changePhone}
                        onRemove={removePhoneNumber}
                    />
                ))
            
        },
        [ changePhone, getAvailableTypes, getContact, removePhoneNumber ]
    )

    const buttonMemo = React.useMemo(
        () => (
            <Button
                className="block mx-auto py-2 px-8"
                onClick={addPhoneNumber}>
                Add new contact
            </Button>
        ),
        [ addPhoneNumber ]
    )

    const closeDialog = React.useCallback(
        () => setDialog(null),
        [ setDialog ]
    )

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(loading || hasErrors) return;

        onCloseFuncRef.current?.()

        const contact = getContact()
        const input = getInput()

        const supplier: SupplierType = {
            address: {
                country: input.address.country.value,
                province: input.address.province.value,
                city: input.address.city.value,
                street: input.address.street.value,
                number: currency(input.address.number.value).value
            },
            contact: {
                phone: contact
                    .phone
                    .map(item => ({ number: item.number.value, type: item.type.value }))
            },
            id: hasSupplier ? supplierPayload.id : null,
            name: input.name.value,
            nuit: currency(input.nuit.value).value,
            status: hasSupplier ? supplierPayload.status : null
        }

        await fetchData(
            {
                options: {
                    body: JSON.stringify(supplier),
                    method: hasSupplier ? "PUT" : "POST"
                },
                onError(error) {
                    alertProps.current = {
                        description: error.message,
                        severity: "error",
                        title: "Error"
                    }
                },
                async onSuccess(res, data) {
                    alertProps.current = {
                        description: "Supplier was successfully registered.",
                        severity: "success",
                        title: "Success"
                    }

                    await suppliers.fetchData({})

                    if(hasSupplier) {
                        closeDialog();
                        return;
                    }

                    resetForm();
                    resetContact();
                },
            }
        )

        onOpenFuncRef.current?.()

    }

    return (
        <form
            className={classNames(styles.form, `box-border px-3 pt-5 pb-8`)}
            onSubmit={submitHandler}>
            { alertMemo }
            <Row>
                <TextField 
                    { ...getInput().name }
                    className="w-full sm:w-1/2"
                    label="Name" 
                    onChange={changeNameHandler}
                    required
                />
                <TextField 
                    { ...getInput().nuit }
                    className="w-full sm:w-1/2"
                    label="NUIT" 
                    onChange={changeNUITHandler}
                    required
                />
            </Row>
            <fieldset
                className="flex flex-col gap-y-4 mt-4">
                <Typography
                    component="legend"
                    className='font-semibold mb-4 text-lg'>
                    Address
                </Typography>
                <Row>
                    <TextField 
                        { ...getInput().address.country }
                        className="mb-0 w-full sm:w-1/2"
                        label="Country" 
                        onChange={changeAddressHandler("country")}
                        required
                    />
                    <TextField 
                        { ...getInput().address.province }
                        className="mb-0 w-full sm:w-1/2"
                        label="Province" 
                        onChange={changeAddressHandler("province")}
                        required
                    />
                </Row>
                <Row>
                    <TextField 
                        { ...getInput().address.city }
                        className="mb-0 w-full sm:w-1/2"
                        label="City" 
                        onChange={changeAddressHandler("city")}
                        required
                    />
                    <TextField 
                        { ...getInput().address.street }
                        className="mb-0 w-full sm:w-1/2"
                        label="Street" 
                        onChange={changeAddressStreetHandler}
                        required
                    />
                </Row>
                <Row>
                    <TextField 
                        { ...getInput().address.number }
                        className="mb-0 w-full sm:w-1/2"
                        label="Number" 
                        onChange={changeAddressNumberHandler}
                        required
                        type="number"
                    />
                </Row>
            </fieldset>
            <fieldset
                className="flex flex-col gap-y-4 mt-8">
                <Typography
                    component="legend"
                    className='font-semibold mb-4 text-lg'>
                    Contact
                </Typography>
                <div className="flex flex-col gap-y-6">
                    {
                        contactListMemo
                    }
                    { buttonMemo }
                </div>
            </fieldset>
            <div className="flex flex-col gap-y-4 justify-end sm:flex-row sm:gap-y-0 sm:gap-x-4 mt-16">
                <Button
                    className="!border-red-600 py-2 !text-red-600 hover:!bg-red-600 hover:!text-white"
                    onClick={closeDialog}
                    type="button"
                    variant="outlined">
                    Cancel
                </Button>
                <Button
                    className="py-2"
                    disabled={loading || hasErrors}
                    type="submit">
                    { loading ? "Loading..." : ( hasSupplier ? "Update" : "Submit" ) }
                </Button>
            </div>
        </form>
    )
}

export default Form