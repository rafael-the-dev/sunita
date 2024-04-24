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
    cartItem: CartItem<ProductInfoType>;
}

const Container = ({ cartItem }: PropsType) => {
    const { addItem, changeQuantity } = React.useContext(SaleContext); //
    const { quantity } = cartItem;

    // add 1 to incriment, or -1 to decrement
    const clickHandler = (value: number) => () => addItem(cartItem.product, value);

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = currency(e.target.value).value;

        changeQuantity(cartItem.product.id, quantity);
    };
    
    const hasError = currency(quantity).value > cartItem.product.stock.quantity || currency(quantity).value <= 0;
    const errorClasses = { "text-red-600": hasError };

    return (
        <div className="flex items-center justify-center">
            <IconButton 
                className={classNames("p-0 text-sm", errorClasses)}
                onClick={clickHandler(-1)}>
                <RemoveIcon className="text-base" />
            </IconButton>
            <input 
                className={classNames(styles.input, errorClasses,
                "bg-transparent border-0 text-center outline-none")}
                onChange={changeHandler}
                value={quantity}
            />
            <IconButton 
                className={classNames("p-0 text-sm", errorClasses)}
                onClick={clickHandler(1)}>
                <AddIcon className="text-base" />
            </IconButton>
        </div>
    );
};

export default Container;