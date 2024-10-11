import * as React from "react"
import classNames from "classnames"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"

import AddIcon from "@mui/icons-material/Add"

type PropsType = {
    onInsert: (image: string) => void;
    placeholder?: string;
}

const InsertInput = ({ onInsert, placeholder }: PropsType) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const clickHandler = () => {
        const value = inputRef.current?.value;

        if(!value?.trim()) return;

        onInsert(value)

        inputRef.current.value = "";
    }

    return (
        <div className="border border-solid border-gray-300 flex items-center py-1 pl-2 pr-1">
            <input 
                className="border-0 font-normal grow outline-none text-small"
                placeholder={placeholder ?? ""}
                ref={inputRef}
            />
            <IconButton
                onClick={clickHandler}
                type="button">
                <AddIcon />
            </IconButton>
        </div>
    )
}

export default InsertInput