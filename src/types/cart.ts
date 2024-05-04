import {} from "./payment-method"

export type CartItem<T> = {
    id: string;
    product: T;
    quantity: number;
    total: number;
}

export type CartType<T> = {
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
    items: RequestCartItem[],
    total: number;
    totalReceived: number;
}