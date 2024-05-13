import { PaymentMethodListItemType } from "@/types/payment-method";

export const paymentMethodsList: PaymentMethodListItemType[] = [
    { value: 100, label: "Cash" },
    { value: 200, label: "M-pesa" },
    { value: 300, label: "E-mola" },
    { value: 400, label: "M-kesh" },
    { value: 500, label: "POS" },
    { value: 600, label: "P24" }
];

// export const paymentMethodsMap = new Map<number, number>()