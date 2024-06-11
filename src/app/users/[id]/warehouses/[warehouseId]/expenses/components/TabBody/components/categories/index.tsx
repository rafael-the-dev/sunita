import { ChangeEvent, useCallback, useRef, useState } from "react"
import classNames from "classnames"

import styles from "./styles.module.css"

import { CategoryType } from "@/types/category"

import ListItem from "./components/ListItem"
import RegisterCategory from "./components/RegisterListItem"
import TextField from "@/components/Textfield"

import useFetch from "@/hooks/useFetch"

const CategoriesContainer = ({ url }: { url: string }) => {
    const [ value, setValue ] = useState("")

    const isFirstRender = useRef(true)

    const { data, fetchData, loading } = useFetch<CategoryType[]>({
        autoFetch: true,
        url
    })

    const changeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value), [])

    const getFilteredList = () => {
        if(!data) return [];

        if(!value.trim()) return data;

        return data.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
    }

    if(loading && isFirstRender.current) return (
        <div className={classNames(styles.form, `font-bold px-3 pb-8 pt-4 text-md`)}>
            Loading...
        </div>
    );

    isFirstRender.current = false;

    return (
        <form className={classNames(styles.form, `px-3 pb-12 pt-4`)}>
            <div>
                <TextField 
                    fullWidth
                    label="Insert category name"
                    onChange={changeHandler}
                    value={value}
                />
            </div>
            <ul className="flex flex-col">
                {
                    getFilteredList().map(item => (
                        <ListItem 
                            { ...item }
                            key={item.id}
                            refreshData={fetchData}
                            url={url}
                        />
                    ))
                }
            </ul>
            <RegisterCategory refreshData={fetchData} url={url} />
        </form>
    )
}

export default CategoriesContainer