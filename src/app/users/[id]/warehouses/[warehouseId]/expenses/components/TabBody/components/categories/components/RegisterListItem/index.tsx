import { ChangeEvent, useCallback, useState } from "react"
import CircularProgress from "@mui/material/CircularProgress"
import IconButton from "@mui/material/IconButton"

import SendIcon from '@mui/icons-material/Send';

import { ClientCategoryRequestType } from "@/types/category";
import { FetchDataFuncType } from "@/hooks/useFetch/types"

import useFetch from "@/hooks/useFetch"

type PropsType = { 
    refreshData: FetchDataFuncType,
    url: string 
}

const RegisterListItem = ({ refreshData, url }: PropsType) => {
    const [ value, setValue ] = useState("")

    const { fetchData, loading } = useFetch({
        autoFetch: false,
        url
    })

    const changeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value), [])

    const submitHandler = () => {
        if(!Boolean(value.trim())) return;

        const category: ClientCategoryRequestType = {
            name: value
        }

        fetchData({
            options: {
                body: JSON.stringify(category),
                method: "POST"
            },
            onSuccess() {
                refreshData({ path: url })
                setValue("")
            }
        })
    }

    return (
        <div className="flex items-center justify-between py-2">
            <input
                className="border-0 grow outline-none"
                onChange={changeHandler}
                placeholder="Insert category name"
                value={value} 
            />
            {
                <IconButton 
                    disabled={!Boolean(value.trim()) || loading}
                    onClick={submitHandler}>
                    { loading ? <CircularProgress size={20} /> : <SendIcon className="text-[1.4rem] opacity-60"/> }
                </IconButton>
            }
        </div>
    )
}

export default RegisterListItem