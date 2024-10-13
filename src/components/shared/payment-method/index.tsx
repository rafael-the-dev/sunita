import * as React from "react";
import { IconButton } from "@mui/material"
import classNames from "classnames"

import DeleteIcon from '@mui/icons-material/Delete';

import styles from "./styles.module.css";

import { PaymentFunctionsType } from "@/hooks/usePayment/types";

import lang from "@/lang/payment.json"

import useLanguage from "@/hooks/useLanguage"

import { PaymentMethodListItemType, PaymentType, PAYMENT_METHODS } from "@/types/payment-method";
import { paymentMethodsList } from "@/config/payment-methods";

import Input from "@/components/Textfield";
import Select from "@/components/shared/combobox"

type PropsType = PaymentFunctionsType & {
    amount: number,
    getPayment: () => PaymentType;
    id: string | number,
    transactionId: string;
}

const PaymentMethodContainer = (props: PropsType) => {

    const {
        amount, 
        id,
        transactionId,
        changePaymentMethodId, changePaymentMethodValue, changePaymentMethodTransactionIdValue,
        getPayment, 
        removePaymentMethod 
    } = props;

    const { language } = useLanguage()

    const filter = React.useCallback(
        (item: PaymentMethodListItemType) => {
            if(item.value === id) return true;

            return !Boolean(
                getPayment()
                    .paymentMethods
                    .find(method => method.id === item.value)
            );
        }, 
        [ getPayment, id ]
    );

    const paymentMethods = React.useMemo(
        () => paymentMethodsList.filter(filter),
        [ filter ]
    )

    const changeHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changePaymentMethodValue("amount", id, e.target.value.trim()), 
        [ changePaymentMethodValue, id ]
    );

    const changeMethodHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changePaymentMethodId(id, parseInt(e.target.value)), 
        [ changePaymentMethodId, id ]
    );

    const removeHandler = React.useCallback(() => removePaymentMethod(id), [ id, removePaymentMethod ]);
    
    const transactionIdChangeHandler = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => changePaymentMethodTransactionIdValue(id, e.target.value),
        [ changePaymentMethodTransactionIdValue, id ]
    );

    return (
        <div className="border-b border-primary-300 border-solid flex flex-col pb-3 pt-8 first:pt-0 
            md:pb-8 md:flex-row md:items-center md:gap-x-6">
            <div className="flex flex-col items-stretch grow md:flex-row md:items-center">
                <Select
                    className={classNames(styles.select, `w-full md:w-1/3`)}
                    label={ lang["payment-methods"]["pm"][language] }
                    list={paymentMethods}
                    onChange={changeMethodHandler}
                    value={id}
                />
                <Input 
                    className={classNames(styles.input, `w-full md:w-1/3`)}
                    label={ lang["payment-methods"]["amount"][language] }
                    onChange={changeHandler}
                    value={amount}
                    variant="outlined"
                />
                {
                    id != PAYMENT_METHODS.CASH && (
                        <Input 
                            className={classNames(styles.input, `w-full md:w-1/3`)}
                            label={ lang["payment-methods"]["transaction"][language] }
                            onChange={transactionIdChangeHandler}
                            value={transactionId}
                            variant="outlined"
                        />
                    )
                }
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