import { SaleClientPaymentMethodsType } from "./payment-method"

export type CartItem<T> = {
    id: string;
    product: T;
    quantity: number;
    total: number;
}

export type CartType<T> = {
    id?: string | number;
    items: CartItem<T>[];
    total:  number;
}

export type RequestCartItem = {
    product: {
        id: string
    };
    quantity: number;
    total: number;
}

export type CartResquestType = {
    changes: number;
    id?: string;
    items: RequestCartItem[];
    paymentMethods: SaleClientPaymentMethodsType;
    total: number;
    totalReceived: number;
}