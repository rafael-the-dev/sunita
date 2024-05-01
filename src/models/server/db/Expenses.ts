import currency from "currency.js";

import { ConfigType } from "@/types/app-config-server";

import { ExpenseClientType, ExpenseInfoType, ExpenseType, ExpenseStatus } from "@/types/expense";
import { WarehouseType } from "@/types/warehouse";

import InvalidArgumentError from "@/errors/server/InvalidArgumentError";
import Store from "./Warehouse";

type PropsType = {
    expense: ExpenseClientType;
    storeId: string;
}

class Expense {

    static async register({ expense, storeId }: PropsType, { mongoDbConfig, user }: ConfigType) {
        const helper = (store: WarehouseType) => {
            const expenses = structuredClone(store.expenses);

            const total = expense.items.reduce((prevValue, currentItem) => {
                return currency(currentItem.price).add(prevValue).value;
            }, 0)

            if(expense.total !== total) throw new InvalidArgumentError("Total price is not correct");

            const newExpense: ExpenseType = {
                category: expense.category,
                createdAt: new Date(Date.now()).toISOString(),
                items: expense.items,
                status: ExpenseStatus.SUCCESSFULL,
                total: expense.total,
                user: "rafaeltivane"
            }

            expenses.push(newExpense)

            return expenses;
        };

        Store.update<ExpenseType[]>(
            {
                helper,
                id: storeId,
                key: "expenses"
            }, 
            { 
                mongoDbConfig, 
                user 
            }
        );
    } 
}

export default Expense;