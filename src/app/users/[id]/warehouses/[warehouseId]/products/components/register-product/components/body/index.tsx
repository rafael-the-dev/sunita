import { useContext } from "react";
import classNames from "classnames";

import TextField from "@mui/material/TextField";

import styles from "./styles.module.css"

import Collapse from "@/components/shared/collapse"
import Categories from "@/components/shared/categories";
import SubmitButton from "@/components/shared/submit-button";

const Body = () => {

    return (
        <form 
            className={classNames(styles.form, `flex flex-col justify-between`)}>
            <div className={classNames(styles.formContent, styles.spacing, `grow overflow-y-auto`)}>
                <div className="md:flex justify-between flex-wrap">
                    <TextField
                        className={classNames(styles.formInput)}
                        placeholder="Name"
                        label="Name"
                    />
                    <TextField
                        className={classNames(styles.formInput)}
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
                    title="Price">
                    <div className="md:flex justify-between flex-wrap rounded">
                        <TextField
                            className={classNames(styles.formInput)}
                            placeholder="Purchase price"
                            label="Purchase price"
                        />
                        <TextField
                            className={classNames(styles.formInput)}
                            placeholder="Sell price"
                            label="Sell price"
                        />
                    </div>
                </Collapse>
            </div>
            <div className={classNames("flex justify-end mt-4", styles.spacing)}>
                <SubmitButton>Submit</SubmitButton>
            </div>
        </form>
    );
};

export default Body