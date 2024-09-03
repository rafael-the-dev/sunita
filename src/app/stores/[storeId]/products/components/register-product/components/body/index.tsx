import { FormEvent, useContext, useEffect, useMemo, useRef } from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

import { PRODUCTS_CATEGORIES, ProductInfoType } from "@/types/product";

import { AppContext } from "@/context/AppContext";
import { LoginContext } from "@/context/LoginContext";
import { ProductFormContext } from "./context";

import useFetch from "@/hooks/useFetch";

import Alert from "@/components/alert"
import Categories from "@/components/shared/categories";
import CarDetails from "./components/Car"
import ClothDetails from "./components/Cloth";
import ExpirableProducts from "./components/ExpirableProducts";
import FurnitureDetails from "./components/Furniture";
import Price from "./components/Price"
import Row from "@/components/Form/RegisterUser/components/Row"
import SubmitButton from "@/components/shared/submit-button";
import TextField from "@/components/Textfield"

let alertProps = {
    description: "",
    severity: "success",
    title: ""
}

const Body = () => {
    const { dialog, fetchDataRef, isLoading } = useContext(AppContext);
    const { credentials } = useContext(LoginContext)
    
    const { 
        changeBarcode,
        changeCategory, 
        changeName,
        changeDescription,
        hasErrors,
        hasPayload,
        input,
        reset,
        toString
    } = useContext(ProductFormContext)
    
    const { fetchData, loading } = useFetch({
        autoFetch: false,
        url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/products`
    })

    const onOpenAlertRef = useRef<() => void>(null)
    const onCloseAlertRef = useRef<() => void>(null)

    const hasError = hasErrors()

    const alertMemo = useMemo(
        () => (
            <Alert 
                { ...alertProps }
                className={classNames("mb-6", loading ?? "")}
                onClose={onCloseAlertRef}
                onOpen={onOpenAlertRef}
            />
        ),
        [ loading ]
    )

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(hasError || loading) return;

        isLoading.current = true;
        onCloseAlertRef.current?.()

        await fetchData({
            options: {
                body: toString(),
                method: hasPayload ? "PUT" : "POST",
                
            },
            path: `/api/stores/${credentials?.user?.stores[0]?.storeId}/products/${hasPayload ? (dialog.payload as ProductInfoType).id: ""}`,
            onError(error) {
                alertProps = {
                    description: error.message,
                    severity: "error",
                    title: "Error"
                }
            },
            async onSuccess(res, data) {
                await fetchDataRef.current?.({})

                reset()

                alertProps = {
                    description: `Product was successfully ${hasPayload ? "updated" : "registered"}`,
                    severity: "success",
                    title: "Success"
                }
            },
            
        })

        onOpenAlertRef.current?.()
        isLoading.current = false
    };

    return (
        <form 
            className={classNames(styles.form, `flex flex-col justify-between`)}
            onSubmit={submitHandler}>
            <div className={classNames(styles.formContent, styles.spacing, `grow overflow-y-auto`)}>
                { alertMemo }
                <TextField
                    { ...input.name }
                    className="mb-6 w-full"
                    placeholder="Name"
                    label="Name"
                    onChange={changeName}
                    required
                />
                <Row>
                    <TextField
                        { ...input.barcode }
                        className="mb-0 w-full sm:w-1/2"
                        placeholder="Insert ID or Barcode"
                        label="Id or barcode"
                        onChange={changeBarcode}
                        required
                    />
                    <Categories 
                        { ...input.category }
                        className="mb-0 w-full sm:w-1/2"
                        onChange={changeCategory}
                    />
                </Row>
                <Price />
                {
                    {
                        [PRODUCTS_CATEGORIES.CARS]: <CarDetails />,
                        [PRODUCTS_CATEGORIES.CLOTH]: <ClothDetails />,
                        [PRODUCTS_CATEGORIES.EXPIRABLE]: <ExpirableProducts />,
                        [PRODUCTS_CATEGORIES.FURNITURE]: <FurnitureDetails />
                    }[input.category.value]
                }
                <Row>
                    <TextField 
                        { ...input.description }
                        className="mt-4 mb-0 w-full"
                        label="Description"
                        multiline
                        minRows={4}
                        onChange={changeDescription}
                    />
                </Row>
            </div>
            <div className={classNames("flex justify-end mt-4", styles.spacing)}>
                <SubmitButton disabled={ hasError || loading }>
                    { loading ? "Loading..." : ( hasPayload ? "Update" : "Submit" ) }
                </SubmitButton>
            </div>
        </form>
    );
};

export default Body