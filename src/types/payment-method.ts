

export type PaymentMethodType = {
    id: string | number;
    amount: number;
}

export type ProductPayment = {
    changes: number;
    paymentMethods: PaymentMethodType[];
    remainingAmount: number;
    totalReceived: number;
}

export type PaymentMethodListItemType = {
    label: string;
    value: string | number
}

export type SaleClientPaymentMethodsType = {
    changes: number;
    list: PaymentMethodType[];
    totalReceived: number;
}
