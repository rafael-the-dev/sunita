import * as React from "react"
import classNames from "classnames"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"

import DeleteIcon from "@mui/icons-material/Close"

import styles from "./styles.module.css"

import { LANGUAGE } from "@/types/language"

import useLanguage from "@/hooks/useLanguage"

import InsertInput from "@/components/Input/InsertInput"

type PropsType = {
    addImage: (image: string) => void;
    list: string[],
    removeImage: (image: string) => void;
}

const lang = {
    placeholder: {
        [LANGUAGE.ENGLISH]: "Insert image's link",
        [LANGUAGE.PORTUGUESE]: "Insere o link da imagem"
    }
}

const ImageContainer = ({ addImage, list, removeImage }: PropsType) => {
    const { language } = useLanguage()

    const removeHandler = (id: string) => () => removeImage(id);

    return (
        <div>
            <InsertInput 
                onInsert={addImage} 
                placeholder={lang.placeholder[language]}
            />
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