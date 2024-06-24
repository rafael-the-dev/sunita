import { STATUS as ExpenseStatus} from "."
import { CategoryType } from "./category";
export { STATUS as ExpenseStatus } from "."

export type ExpenseItemType = {
    description: string;
    id: string;
    price: number;
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
    category: CategoryType;
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
