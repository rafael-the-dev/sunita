import { PaymentMethodType } from "./payment-method";
import { ProductInfoType } from "./product";
type ItemType =  {
    id: string;
    product: {
        id: string;
        price: number;
    }
    quantity: number;
    total: number;
};

export type SaleItemType = ItemType

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


type DebtType = {
    changes: number;
    createdAt: Date | string;
    createdBy: String;
    dueDate: string;
    id: string;
    items: ItemType[];
    latePaymentFine: boolean;
    profit: number;
    paymentMethods: PaymentMethodType[];
    remainingAmount: number;
    total: number;
    totalReceived: number;
}

export type SaleDebtType = DebtType & {
    customer: string;
}