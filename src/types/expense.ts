

export type ExpenseItemType = {
    description: string;
    id: string;
    price: number;
}

export enum ExpenseStatus {
    "SUCCESSFULL",
    "UNSUCCESSFULL"
}

export type ExpenseClientType = {
    category: string;
    items: ExpenseItemType[],
    total: number;
}

export type ExpenseType = {
    category: string;
    createdAt: string | Date;
    id: string;
    items: ExpenseItemType[],
    status: ExpenseStatus;
    total: number;
    user: string;
}

export type ExpenseInfoType = {
    category: string;
    createdAt: string | Date;
    id: string;
    items: ExpenseItemType[],
    status: ExpenseStatus;
    total: number;
    user: {
        firstName: string;
        lastName: string;
        username: string;
    };
}