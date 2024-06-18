import { PaymentMethodType } from "./payment-method";
import { ProductInfoType } from "./product";

export type SaleItemType =  {
    id: string;
    product: {
        id: string;
        price: number;
    }
    quantity: number;
    total: number;
};

export type SaleType = {
    changes: number;
    createdAt: Date | string;
    id: string;
    profit: number;
    items: SaleItemType[];
    paymentMethods: PaymentMethodType[];
    total: number;
    totalReceived: number;
    user: string;
};

export type SaleInfoItemType = {
    id: string;
    product: ProductInfoType;
    quantity: number;
    total: number;
};

export type SaleInfoType = SaleType & {
    items: SaleInfoItemType[];
    user: { 
        firstName: string;
        lastName: string;
        username: string;
    }
};