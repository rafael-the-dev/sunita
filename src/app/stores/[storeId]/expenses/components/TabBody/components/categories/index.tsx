import { ChangeEvent, useCallback, useRef, useState } from "react"
import classNames from "classnames"

import styles from "./styles.module.css"

import { CategoryType } from "@/types/category"
import { FetchDataFuncType } from "@/hooks/useFetch/types"
import {LANGUAGE} from "@/types/language"

import ListItem from "./components/ListItem"
import RegisterCategory from "./components/RegisterListItem"
import TextField from "@/components/Textfield"

import useFetch from "@/hooks/useFetch"
import useLanguage from "@/hooks/useLanguage"

const CategoriesContainer = ({ list, refetchData, url }: { refetchData?: FetchDataFuncType, list?: CategoryType[], url: string }) => {
    const [ value, setValue ] = useState("")

    const { translate } = useLanguage()

    const isFirstRender = useRef(true)
    
    const { data, fetchData, loading } = useFetch<CategoryType[]>({
        autoFetch: !Boolean(list),
        url
    })

    const changeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value), [])

    const getData = () => list ?? data;

    const getFilteredList = () => {
        const data = getData()

        if(!data) return [];

        if(!value.trim()) return data;

        return data.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
    }

    const refreshData = () => list ? refetchData : fetchData;

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
                    label={
                        translate(
                            {
                                [LANGUAGE.ENGLISH]: "Insert category name",
                                [LANGUAGE.PORTUGUESE]: "Insere o nome da categoria"
                            }
                        )
                    }
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
                            refreshData={refreshData()}
                            url={url}
                        />
                    ))
                }
            </ul>
            <RegisterCategory refreshData={refreshData()} url={url} />
        </form>
    )
}

export default CategoriesContainer