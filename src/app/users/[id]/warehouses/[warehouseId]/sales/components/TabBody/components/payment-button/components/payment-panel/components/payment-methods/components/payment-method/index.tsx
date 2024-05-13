import * as React from "react";
import { IconButton, MenuItem } from "@mui/material"
import classNames from "classnames"

// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

import styles from "./styles.module.css";

// import { CheckoutContext } from "src/context"

import { SaleContext } from "@/context/SalesContext/context/SaleContext";
import { PaymentMethodListItemType } from "@/types/payment-method";
import { paymentMethodsList } from "@/config/payment-methods";

import Input from "@/components/Textfield";

const PaymentMethodContainer = ({ amount, id }) => {

    const { 
        changePaymentMethodId, changePaymentMethodValue,
        getPaymentMethods, 
        removePaymentMethod 
    } = React.useContext(SaleContext);

    const filter = React.useCallback((item: PaymentMethodListItemType) => {
        if(item.value === id) return true;

        return !Boolean(getPaymentMethods().paymentMethods.find(method => {
            return method.id === item.value
        }));
    }, [ getPaymentMethods, id ]);

    const changeHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changePaymentMethodValue("amount", id, e.target.value.trim())
    , [ changePaymentMethodValue, id ]);

    const changeMethodHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changePaymentMethodId(id, parseInt(e.target.value)), 
    [ changePaymentMethodId, id ]);

    const clearRemaingAmount = () => {
        // getPaymentMethods().clearRemaingAmount(id);
    };

    const removeHandler = React.useCallback(() => removePaymentMethod(id), [ id, removePaymentMethod ]);
    
    const receivedAmountChangeHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changePaymentMethodValue("receivedAmount", id, e.target.value.trim())
    , [ changePaymentMethodValue, id ]);

    return (
        <div className="border-b border-primary-300 border-solid flex flex-col pb-3 pt-8 first:pt-0 md:pb-8 md:flex-row md:items-center">
            <Input
                className={classNames(styles.select)}
                label="Payment method"
                onChange={changeMethodHandler}
                select
                value={id}
                variant="outlined"
                >
                {
                    paymentMethodsList
                        .filter(filter)
                        .map(item => (
                        <MenuItem key={item.value} value={item.value}>
                            { item.label }
                        </MenuItem>
                    ))
                }
            </Input>
            <div className="flex items-center justify-between w-full md:justify-normal">
                <Input 
                    className={styles.input}
                    label="Insert amount"
                    onChange={changeHandler}
                    value={amount}
                    variant="outlined"
                />
                {/*<Input 
                    className={styles.input}
                    label="Valor recebido"
                    onChange={receivedAmountChangeHandler}
                    value={receivedAmount}
                    variant="outlined"
                />*/}
            </div>
            <div className="flex">
                { /*getPaymentMethods().amountRemaining() > 0 && (
                    <IconButton 
                        className="text-blue-500 hover:text-blue-700"
                        onClick={clearRemaingAmount}>
                        <CheckCircleIcon />
                    </IconButton>
                )*/}
                <IconButton 
                    className="hover:text-red-600" 
                    onClick={removeHandler}>
                    <DeleteIcon />
                </IconButton>
            </div>
        </div>
    );
};

export default PaymentMethodContainer;