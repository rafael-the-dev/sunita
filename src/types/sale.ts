import { ProductInfoType } from "./product";


export type SaleType = {
    changes: number;
    createAt: Date;
    id: string;
    profit: number;
    items: {
        id: string;
        price: number;
        quantity: number;
    }[];
    total: number;
    totalReceived: number;
    user: string;
}

export type SaleInfoType = {
    changes: number;
    createAt: Date;
    id: string;
    items: {
        product: ProductInfoType;
        quantity: number;
    }[];
    total: number;
    totalReceived: number;
    user: string;
}