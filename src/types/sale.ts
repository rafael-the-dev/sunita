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
    createdBy: String;
    dueDate: string;
    id: string;
    latePaymentFine: boolean;
    profit: number;
    paymentMethods: PaymentMethodType[];
    remainingAmount: number;
    total: number;
    totalReceived: number;
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
    items: {
        quantity: number,
        total: number,
        product: {
            barcode: string,
            category: string,
            id: string,
            name: string,
            sellPrice: string,
        }
    }[],
    user: { 
        firstName: string,
        lastName: string,
        username: string
    }
}