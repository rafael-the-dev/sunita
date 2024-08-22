import * as React from "react"
import classNames from "classnames"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"

import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Close"

import styles from "./styles.module.css"


type PropsType = {
    addImage: (image: string) => void;
    list: string[],
    removeImage: (image: string) => void;
}

const ImageContainer = ({ addImage, list, removeImage }: PropsType) => {

    const inputRef = React.useRef<HTMLInputElement>(null);

    const clickHandler = () => {
        const value = inputRef.current?.value;

        if(!value?.trim()) return;

        addImage(value)

        inputRef.current.value = "";
    }

    const removeHandler = (id: string) => () => removeImage(id);

    return (
        <div>
            <div className="border border-solid border-gray-300 flex items-center py-1 pl-2 pr-1">
                <input 
                    className="border-0 font-normal grow outline-none text-small"
                    placeholder="Insert image link"
                    ref={inputRef}
                />
                <IconButton
                    onClick={clickHandler}
                    type="button">
                    <AddIcon />
                </IconButton>
            </div>
            <ul className="flex gap-x-3 flex-wrap mt-3">    
                {
                    list.map((item) => (
                        <li 
                            className={classNames(styles.listItem, "relative")}
                            key={item}>
                            <Avatar 
                                src={item}
                                sx={{ width: 56, height: 56 }}
                                variant="square"
                            />
                            <IconButton
                                className={classNames("absolute bg-opacity-60 bg-white right-0 top-0 text-red-600")}
                                onClick={removeHandler(item)}>
                                <DeleteIcon />
                            </IconButton>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default ImageContainer