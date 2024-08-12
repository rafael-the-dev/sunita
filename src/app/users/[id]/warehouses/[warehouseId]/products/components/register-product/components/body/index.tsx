import { useContext, useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import currency from "currency.js";
import classNames from "classnames";

import styles from "./styles.module.css";

import { ProductInfoType, ProductType, PRODUCTS_CATEGORIES } from "@/types/product";

import { AppContext } from "@/context/AppContext";
import { LoginContext } from "@/context/LoginContext";
import { ProductFormContext } from "./context";

import Categories from "@/components/shared/categories";
import CarDetails from "./components/Car"
import ClothDetails from "./components/Cloth";
import ExpirableProducts from "./components/ExpirableProducts";
import FurnitureDetails from "./components/Furniture";
import Price from "./components/Price"
import Row from "@/components/Form/RegisterUser/components/Row"
import SubmitButton from "@/components/shared/submit-button";
import TextField from "@/components/Textfield"

type FormstateType = {

};

const Body = () => {
    const { dialog, isLoading } = useContext(AppContext);
    const { credentials, user } = useContext(LoginContext)
    const { 
        changeCategory, 
        changeName,
        changePrice,
        input 
    } = useContext(ProductFormContext)

    const isFirstRender = useRef(true);
    const formRef = useRef<HTMLFormElement | null>(null);

    const submitHandler = async (prevState, formData) => {
        if(dialog?.payload && isFirstRender.current) {
            const { name } = dialog.payload as ProductInfoType;

            isFirstRender.current = false;
            
            return {
                ...prevState,
                'name-input': name
            };
            
            /*console.log(dialog?.payload)
            const formData = new FormData(formRef.current);

            const { name } = dialog.payload as ProductInfoType;

            formData.set("name-input", name);
            console.log(formData.get("name-input"))
            isFirstRender.current = false;*/
        }

        const product: ProductType = {
            barcode: formData.get("barcode-input"),
            category: input.category.value,
            id: "123456789",
            name: formData.get("name-input"),
            purchasePrice: currency(formData.get("purchase-price-input")).value,
            sellPrice: currency(formData.get("sell-price-input")).value
        };

        isLoading.current = true;

        try {
            const body = JSON.stringify(product);

            await fetch(`/api/stores/${credentials?.user?.stores[0]?.storeId}/products`, { method: "POST", body });
            return product;
        } catch(e) {
            console.error(e)
        } finally {
            isLoading.current = false;
        }
    };

    const [ state, formAction ] = useFormState(submitHandler, { 'name-input': "", hasErrors: false });
    
    useEffect(() => {
        if(dialog?.payload && isFirstRender.current) {
            const formData = new FormData(formRef.current);
            //console.log(formRef.current.querySelector("name='name-input'"))
            const { name } = dialog.payload as ProductInfoType;
            
            formData.set("name-input", name)
        }
    }, [ dialog ]);

    return (
        <form 
            action={formAction}
            className={classNames(styles.form, `flex flex-col justify-between`)}
            ref={formRef}>
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
                        className="mt-4 mb-0 w-full"
                        label="Description"
                        multiline
                        minRows={4}
                    />
                </Row>
            </div>
            <div className={classNames("flex justify-end mt-4", styles.spacing)}>
                <SubmitButton>
                    { dialog?.payload ? "Update" : "Submit"  }
                </SubmitButton>
            </div>
        </form>
    );
};

export default Body

/**
 * 
                    <TextField
                        className={classNames(styles.formInput)}
                        name="barcode-input"
                        placeholder="Barcode"
                        label="Barcode"
                    />
                    <TextField
                        className={classNames(styles.formInput)}
                        placeholder="Expires in"
                        label="Expires in"
                    />
 */