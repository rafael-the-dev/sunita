import { FormEvent, useContext, useEffect, useRef } from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

import { PRODUCTS_CATEGORIES, ProductInfoType } from "@/types/product";

import { AppContext } from "@/context/AppContext";
import { LoginContext } from "@/context/LoginContext";
import { ProductFormContext } from "./context";

import useFetch from "@/hooks/useFetch";

import Categories from "@/components/shared/categories";
import CarDetails from "./components/Car"
import ClothDetails from "./components/Cloth";
import ExpirableProducts from "./components/ExpirableProducts";
import FurnitureDetails from "./components/Furniture";
import Price from "./components/Price"
import Row from "@/components/Form/RegisterUser/components/Row"
import SubmitButton from "@/components/shared/submit-button";
import TextField from "@/components/Textfield"

const Body = () => {
    const { dialog, isLoading } = useContext(AppContext);
    const { credentials } = useContext(LoginContext)
    
    const { 
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

    const hasError = hasErrors()

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(hasError || loading) return;

        isLoading.current = true;

        fetchData({
            options: {
                body: toString(),
                method: hasPayload ? "PUT" : "POST",
                
            },
            path: `/api/stores/${credentials?.user?.stores[0]?.storeId}/products/${hasPayload ? (dialog.payload as ProductInfoType).id: ""}`,
            onSuccess(res, data) {
                reset()
            },
            
        })
    };

    return (
        <form 
            className={classNames(styles.form, `flex flex-col justify-between`)}
            onSubmit={submitHandler}>
            <div className={classNames(styles.formContent, styles.spacing, `grow overflow-y-auto`)}>
                <Row>
                    <TextField
                        { ...input.name }
                        className="mb-0 w-full sm:w-1/2"
                        name="name-input"
                        placeholder="Name"
                        label="Name"
                        onChange={changeName}
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