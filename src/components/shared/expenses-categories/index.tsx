import { ChangeEvent } from "react"
import classNames from "classnames";

import styles from "./styles.module.css"
import { CategoryType, CATEGORY_STATUS } from "@/types/category";

import useFetch from "@/hooks/useFetch";

import Combobox from "@/components/shared/combobox";

type PropsType = {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    value: string,
    showAll?: boolean
}

const Categories = ({ onChange, showAll, value }: PropsType) => {

    const { data } = useFetch<CategoryType[]>({
        autoFetch: true,
        url: `/api/users/rafaeltivane/warehouses/12345/expenses/categories?status=${showAll ? "" : CATEGORY_STATUS.ACTIVE}`
    })

    const getList = () => {
        if(!data) return [];

        const list = [
            {
                id: -1,
                name: "All"
            },
            ...data
        ]

        return list.map(({ id, name }) => ({
            label: name,
            value: id
        }))
    }

    return (
        <Combobox 
            className={classNames(styles.input)}
            label="Category"
            list={getList()}
            onChange={onChange}
            value={value}
        />
    )
}

export default Categories