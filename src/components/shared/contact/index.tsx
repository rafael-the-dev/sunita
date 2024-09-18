import { ChangeEvent } from "react"
import classNames from "classnames"
import IconButton from "@mui/material/IconButton"

import DeleteIcon from "@mui/icons-material/Delete"

import styles from "./styles.module.css"

import { PHONE_TYPE } from "@/types/contact"

import Select from "@/components/shared/combobox"
import TextField from "@/components/Textfield"

type InputType = {
    error: boolean;
    helperText: string;
    value: string;
}

type PropsType = {
    list: {
        label: string;
        value: string;
    }[];
    number: InputType,
    onChange: (id: PHONE_TYPE, prop: "number" | "type") => (e: ChangeEvent<HTMLInputElement>) => void;
    onRemove: (id: PHONE_TYPE) => () => void;
    type: InputType & { value: PHONE_TYPE }
}

const Contact = ({ list, number, onChange, onRemove, type }: PropsType) => {

    return (
        <div className="border-b border-solid border-gray-200 flex flex-col justify-between pb-2 sm:flex-row sm:items-center">
            <div className={classNames(styles.inputContainer, "flex flex-col items-stretch sm:flex-row sm:gap-x-4")}>
                <Select 
                    { ...type }
                    className="w-full sm:w-1/2"
                    label="Type"
                    list={[ ...list, { label: type.value, value: type.value }]}
                    onChange={onChange(type.value, "type")}
                />
                <TextField 
                    { ...number }
                    className="w-full sm:w-1/2"
                    onChange={onChange(type.value, "number")}
                    placeholder="Insert phone number"
                    label="Number"
                />
            </div>
            <IconButton
                className="w-fit"
                onClick={onRemove(type.value)}>
                <DeleteIcon />
            </IconButton>
        </div>
    )
}

export default Contact