import * as React from "react";
import { IconButton } from "@mui/material"
import classNames from "classnames"

import DeleteIcon from '@mui/icons-material/Delete';

import styles from "./styles.module.css";

import { PaymentFunctionsType } from "@/hooks/usePayment/types";

import { PaymentMethodListItemType, PaymentType } from "@/types/payment-method";
import { paymentMethodsList } from "@/config/payment-methods";

import Input from "@/components/Textfield";
import Select from "@/components/shared/combobox"

type PropsType = PaymentFunctionsType & {
    amount: number,
    getPayment: () => PaymentType;
    id: string | number
}

const PaymentMethodContainer = (props: PropsType) => {

    const {
        amount, 
        id,

        changePaymentMethodId, changePaymentMethodValue,
        getPayment, 
        removePaymentMethod 
    } = props;


    const filter = React.useCallback((item: PaymentMethodListItemType) => {
        if(item.value === id) return true;

        return !Boolean(getPayment().paymentMethods.find(method => {
            return method.id === item.value
        }));
    }, [ getPayment, id ]);

    const paymentMethods = React.useMemo(
        () => paymentMethodsList.filter(filter),
        [ filter ]
    )

    const changeHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changePaymentMethodValue("amount", id, e.target.value.trim())
    , [ changePaymentMethodValue, id ]);

    const changeMethodHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changePaymentMethodId(id, parseInt(e.target.value)), 
    [ changePaymentMethodId, id ]);

    const removeHandler = React.useCallback(() => removePaymentMethod(id), [ id, removePaymentMethod ]);
    
    const receivedAmountChangeHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changePaymentMethodValue("receivedAmount", id, e.target.value.trim())
    , [ changePaymentMethodValue, id ]);

    return (
        <div className="border-b border-primary-300 border-solid flex flex-col pb-3 pt-8 first:pt-0 md:pb-8 md:flex-row md:items-center">
            <Select
                className={classNames(styles.select)}
                label="Payment method"
                list={paymentMethods}
                onChange={changeMethodHandler}
                value={id}
            />
            <div className="flex items-center justify-between w-full md:justify-normal">
                <Input 
                    className={styles.input}
                    label="Insert amount"
                    onChange={changeHandler}
                    value={amount}
                    variant="outlined"
                />
            </div>
            <div className="flex">
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