export enum PAYMENT_METHODS {
    CASH = 100,
    M_PESA = 200,
    E_MOLA = 300,
    M_KESH = 400,
    P24 = 500,
    POS = 600
}

export enum PAYMENT_STATUS {
    PAID = "paid",
    PENDING = "pending",
    UNPAID = "unpaid"
}

export type PaymentMethodType = {
    amount: number;
    id: string | number;
    transactionId: string;
}

export type PaymentType = {
    createdAt?: string;
    changes: number;
    paymentMethods: PaymentMethodType[];
    remainingAmount: number;
    totalReceived: number;
}

export type ProductPayment = PaymentType;

export type PaymentMethodListItemType = {
    label: string;
    value: string | number
}

export type SaleClientPaymentMethodsType = {
    changes: number;
    list: PaymentMethodType[];
    totalReceived: number;
}
