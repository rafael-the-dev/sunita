

export type CartItem<T> = {
    product: T;
    quantity: number;
    total: number;
}

export type CartType<T> = {
    items: CartItem<T>[];
    total:  number;
}