import { ChangeEvent, useContext } from "react"
import classNames from "classnames";

import styles from "./styles.module.css"
import { CategoryType, CATEGORY_STATUS } from "@/types/category";

import { LoginContext } from "@/context/LoginContext";

import useFetch from "@/hooks/useFetch";

import Combobox from "@/components/shared/combobox";

type PropsType = {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    value: string,
    showAll?: boolean
}

const Categories = ({ onChange, showAll, value }: PropsType) => {
    const { credentials } = useContext(LoginContext)

    const { data } = useFetch<CategoryType[]>({
        autoFetch: true,
        url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/expenses/categories?status=${showAll ? "" : CATEGORY_STATUS.ACTIVE}`
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