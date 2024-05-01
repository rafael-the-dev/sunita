import { ExpenseInfoType } from "./expense";
import { SaleInfoType } from "./sale";

export type AnalyticsExpenseType = {
    list: ExpenseInfoType[];
    total: number;
}

export type AnalyticsType = {
    expenses: AnalyticsExpenseType;
    profit: number;
    sales: {
        list: SaleInfoType[];
        profit: number;
        total: number;
    };
}