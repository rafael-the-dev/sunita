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

type AbstractSaleType = {
    changes: number;
    createdAt: Date | string;
    id: string;
    profit: number;
    paymentMethods: PaymentMethodType[];
    total: number;
    totalReceived: number;
}

export type SaleType = AbstractSaleType & {
    items: SaleItemType[];
    user: string;
};

export type SaleInfoItemType = {
    id: string;
    product: ProductInfoType;
    quantity: number;
    total: number;
};

type SaleUserType = { 
    firstName: string;
    lastName: string;
    username: string;
}

export type SaleInfoType = AbstractSaleType & {
    items: SaleInfoItemType[];
    user: SaleUserType
};


export type DebtType = AbstractSaleType & {
    createdBy: String;
    dueDate: string;
    latePaymentFine: boolean;
    remainingAmount: number;
}

export type SaleDebtType = DebtType & {
    createdAt: Date | string;
    customer: string;
    items: ItemType[];
}

export type SaleDebtInfoType = DebtType & {
    customer: { 
        firstName: string,
        lastName: string,
        username: string
    },
    items: SaleInfoItemType[],
    user: SaleUserType
}