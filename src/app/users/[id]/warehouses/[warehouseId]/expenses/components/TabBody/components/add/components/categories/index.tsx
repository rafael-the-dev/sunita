import { ChangeEvent, useCallback, useContext, useState} from "react"
import classNames from "classnames";

import styles from "./styles.module.css"
import { CategoryType, CATEGORY_STATUS } from "@/types/category";

import useFetch from "@/hooks/useFetch";
import { ExpensesContext } from "@/context/ExpensesContext";

import Combobox from "@/components/shared/combobox";

const Categories = () => {
    const { addCategory, getCategory } = useContext(ExpensesContext);

    const { data } = useFetch<CategoryType[]>({
        autoFetch: true,
        url: `/api/users/rafaeltivane/warehouses/12345/expenses/categories?status=${CATEGORY_STATUS.ACTIVE}`
    })

    const getList = () => {
        if(!data) return [];

        return data.map(({ id, name }) => ({
            label: name,
            value: id
        }))
    }

    const changeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => addCategory(e.target.value), [ addCategory ]);

    return (
        <Combobox 
            className={classNames(styles.input)}
            label="Category"
            list={getList()}
            onChange={changeHandler}
            value={getCategory()}
        />
    )
}

export default Categories