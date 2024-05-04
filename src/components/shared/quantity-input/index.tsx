import * as React from "react";
import IconButton from "@mui/material/IconButton";
import classNames from "classnames";
import currency from "currency.js";

import styles from "./styles.module.css";

import { SaleContext } from "@/context/SalesContext/context/SaleContext"
import { CartItem } from "@/types/cart";
import { ProductInfoType } from "@/types/product";

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

type PropsType = {
    onDecrement: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onIncrement: (e: React.MouseEvent<HTMLButtonElement>) => void;
    hasError: boolean;
    value: string | number;
}

const Container = ({ hasError, onChange, onDecrement, onIncrement, value }: PropsType) => {

    // add 1 to incriment, or -1 to decrement

    const errorClasses = { "text-red-600": hasError };

    return (
        <div className="flex items-center justify-center">
            <IconButton 
                className={classNames("p-0 text-sm", errorClasses)}
                onClick={onDecrement}>
                <RemoveIcon className="text-base" />
            </IconButton>
            <input 
                className={classNames(styles.input, errorClasses,
                "bg-transparent border-0 text-center outline-none")}
                onChange={onChange}
                value={value}
            />
            <IconButton 
                className={classNames("p-0 text-sm", errorClasses)}
                onClick={onIncrement}>
                <AddIcon className="text-base" />
            </IconButton>
        </div>
    );
};

export default Container;