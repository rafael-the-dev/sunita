import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { styled } from "@mui/material/styles"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"
import classNames from "classnames";

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';

import { CATEGORY_STATUS, CategoryType } from "@/types/category";
import { FetchDataFuncType } from "@/hooks/useFetch/types";

import useFetch from "@/hooks/useFetch"

import TextField from "@/components/Textfield"

type PropsTypes = CategoryType & {
    refreshData: FetchDataFuncType,
    url: string
}

const Input = styled(TextField)({
    '&': {
        marginBottom: 0
    },
    '& .MuiSelect-select': {
        fontSize: ".85rem",
        padding: ".25rem .4rem"
    }
});


const ListItem = ({ id, name, refreshData, status, url }: PropsTypes) => {
    const [ open, setOpen ] = useState(false)
    const [ currentStatus, setCurrentStatus ] = useState(status)
    const currentStatusRef = useRef(status)

    const { fetchData, loading } = useFetch({
        autoFetch: false,
        url: ``
    })

    const inputRef = useRef<HTMLInputElement>(null)

    const toggle = useCallback(() => setOpen(open => !open), [])

    const iconClassName = "text-[1.2rem] opacity-60";

    const editSubmitHandler = useCallback(() => {
        const category: CategoryType = {
            id,
            name: inputRef.current.value,
            status: currentStatusRef.current
        }

        fetchData({
            options: {
                body: JSON.stringify(category),
                method: "PUT"
            },
            async onSuccess() {
                await refreshData({
                    path: url
                })
                setOpen(false)
            },
            path: `${url}/${id}`
        })
    },  [ fetchData, id, refreshData, url])

    const onCloseElements = useMemo(() => (
        <>
            <Chip 
                classes={{ root: classNames(status === CATEGORY_STATUS.ACTIVE ? "bg-green-400" : "bg-red-600") }}
                className={classNames(`mr-3 text-xs text-gray-700`)}
                label={status} 
            />
            <IconButton className="hover:text-primary-700" onClick={toggle}>
                <EditIcon className={iconClassName} />
            </IconButton>
        </>
    ), [ status, toggle ])

    const statusChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => setCurrentStatus(e.target.value as CATEGORY_STATUS), [])
    
    const statusInputMemo = useMemo(() => (
        <Input
            onChange={statusChangeHandler}
            select
            value={currentStatus}>
            {
                Object.entries(CATEGORY_STATUS).map(([key, value]) => (
                    <MenuItem 
                        className="capitalize"
                        key={value}
                        value={value}
                    >
                        { key }
                    </MenuItem>
                ))
            }
        </Input>
    ), [ currentStatus, statusChangeHandler ])

    const onOpenElements = useMemo(() => (
        <>
            <IconButton className="" onClick={toggle}>
                <CloseIcon className={iconClassName}/>
            </IconButton>
            <IconButton disabled={loading} onClick={editSubmitHandler}>
                { loading ? <CircularProgress size={20} /> : <SendIcon className={iconClassName} /> }
            </IconButton>
        </>
    ), [ editSubmitHandler, loading, toggle ])
    
    useEffect(() => {
        if(open) {
            inputRef.current.value = name;
            inputRef.current.focus();
        }
    }, [ name, open ])

    useEffect(() => {
        currentStatusRef.current = currentStatus
    }, [ currentStatus ])

    return (
        <li className="border-b border-primary-300 border-solid flex items-center justify-between py-2">
            {
                !open && (
                    <Typography
                        className="text-primary-600"
                        component="span">
                        { name }
                    </Typography>
                )
            }
            {
                open && (
                    <input 
                        className="border-0 grow outline-none"
                        ref={inputRef}
                    />
                )
            }
            <div className="flex items-center ml-4">
                { !open && onCloseElements }
                { open && (
                    <>
                        { statusInputMemo }
                        { onOpenElements }
                    </>
                )}
            </div>
        </li>
    )
}

export default ListItem