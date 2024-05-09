import * as React from "react";
import classNames from "classnames";
import { IconButton, Paper } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import styles from "./styles.module.css"
import { ExpensesContext } from "@/context/ExpensesContext";

import TextField from "@/components/Textfield";

type PropsType = {
    description: string;
    id: string;
    price: number;
}

const ListItem = ({ description, id, price }: PropsType) => {
    const { getItems, removeItem, updateItem } = React.useContext(ExpensesContext);//:;

    const hasOneItemLeft = getItems().length === 1;

    const changeHandler = React.useCallback((prop: string) => ({ target: { value } }) => {
        updateItem(id, prop, value)
    }, []);

    const removeHandler = React.useCallback(() => removeItem(id), [ id, removeItem ]);

    return (
        <Paper 
            className={classNames(styles.container, "flex flex-wrap justify-between mb-6 px-3 py-6 rounded-none")}
            elevation={1}>
            <TextField 
                className={classNames(`mb-4 w-full`, { "mb-0": hasOneItemLeft })}
                label="Price"
                onChange={changeHandler("price")}
                required
                value={price}
            />
            <TextField 
                className={classNames(`mb-0 w-full`)}
                label="Description"
                multiline
                minRows={4}
                onChange={changeHandler("description")}
                required
                value={description}
            />
            <IconButton
                className={classNames("bg-stone-50 mt-4 opacity-65 hover:text-red-600", { "hidden": hasOneItemLeft })}
                onClick={removeHandler}>
                <DeleteIcon />
            </IconButton>
        </Paper>
    );
};

export default ListItem