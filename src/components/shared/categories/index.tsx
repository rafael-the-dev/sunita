import { ChangeEvent, useMemo } from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

import { PRODUCTS_CATEGORIES } from "@/types/product"

import Select from "../combobox"

type PropsType = {
    className?: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    value: PRODUCTS_CATEGORIES
}

const Categories = (props: PropsType) => {

    const list = useMemo(
        () => Object
            .values(PRODUCTS_CATEGORIES)
            .map(
                category => (
                    {
                        label: category,
                        value: category
                    }
                )
            ),
        []
    );

    return (
        <Select 
            { ...props }
            className={classNames(styles.formInput)}
            label="Categories"
            list={list}
        />
    );
};

export default Categories;