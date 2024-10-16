import currency from "currency.js";

import { SaleInfoType } from "@/types/sale";
import { ExpenseInfoType } from "@/types/expense";
import { resetDate } from "./date";

export const getFilters = (key: string, searchParams: URLSearchParams) => {
    const endDate = searchParams.get("end-date")
    const products = searchParams.getAll("product");
    const users = searchParams.getAll("user")
    const startDate = searchParams.get("start-date")
    
    return {
        ...( resetDate({ endDate, key, startDate }) ),
       ...( products.length > 0 ? { "sales.items": { $elemMatch: { "product.id": { $in: products } } } } : {} ),
        ...(users.length > 0 ? { "sales.user": { $in: users  }} : {}),
    }
}

export const getExpensesTotalPrice = (expenses: ExpenseInfoType[]) => {
    const total = expenses.reduce((prevValue, currentExpense) => {
        return currency(prevValue).add(currentExpense.total).value
    }, 0);

    return total;
};

export const getSalesStats = (sales: SaleInfoType[]) => {
    const salesStats = {
        profit: 0,
        total: 0
    };

    sales.forEach((currentSale) => {
        salesStats.profit = currency(salesStats.profit).add(currentSale.profit ?? 0).value;
        salesStats.total = currency(salesStats.total).add(currentSale.total).value;
    });

    return salesStats;
};
