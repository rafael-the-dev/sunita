import { useContext } from "react";
import { useFormState } from "react-dom";
import classNames from "classnames";

import TextField from "@mui/material/TextField";

import styles from "./styles.module.css";

import { AppContext } from "@/context/AppContext";
import { LoginContext } from "@/context/LoginContext";
import { ProductType } from "@/types/product";

import Collapse from "@/components/shared/collapse"
import Categories from "@/components/shared/categories";
import SubmitButton from "@/components/shared/submit-button";
import currency from "currency.js";

type FormstateType = {

};

const Body = () => {
    const { dialog, isLoading } = useContext(AppContext);
    const { user } = useContext(LoginContext)

    const submitHandler = async (prevState, formData) => {
        const product: ProductType = {
            barcode: formData.get("barcode-input"),
            category: "t-shirt",
            id: "123456789",
            name: formData.get("name-input"),
            purchasePrice: currency(formData.get("purchase-price-input")).value,
            sellPrice: currency(formData.get("sell-price-input")).value
        };

        isLoading.current = true;

        try {
            const body = JSON.stringify(product);

            await fetch(`/api/users/${"rafaeltivane"}/warehouses/12345/products`, { method: "POST", body })
        } catch(e) {
            console.error(e)
        } finally {
            isLoading.current = false;
        }
    };

    const [ state, formAction ] = useFormState(submitHandler, { hasErrors: false });

    return (
        <form 
            action={formAction}
            className={classNames(styles.form, `flex flex-col justify-between`)}>
            <div className={classNames(styles.formContent, styles.spacing, `grow overflow-y-auto`)}>
                <div className="md:flex justify-between flex-wrap">
                    <TextField
                        className={classNames(styles.formInput)}
                        name="name-input"
                        placeholder="Name"
                        label="Name"
                    />
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
                    <Categories />
                </div>
                <Collapse
                    classes={{ root: "border border-primary-300 border-solid rounded-md" }}
                    highlightOnOpen
                    title="Price">
                    <div className="md:flex justify-between flex-wrap rounded">
                        <TextField
                            className={classNames(styles.formInput)}
                            name="purchase-price-input"
                            placeholder="Purchase price"
                            label="Purchase price"
                        />
                        <TextField
                            className={classNames(styles.formInput)}
                            name="sell-price-input"
                            placeholder="Sell price"
                            label="Sell price"
                        />
                    </div>
                </Collapse>
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