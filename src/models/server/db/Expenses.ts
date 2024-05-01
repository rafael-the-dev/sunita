import currency from "currency.js";

import { ConfigType } from "@/types/app-config-server";

import { ExpenseClientType, ExpenseInfoType, ExpenseType, ExpenseStatus } from "@/types/expense";
import { WarehouseType } from "@/types/warehouse";

import InvalidArgumentError from "@/errors/server/InvalidArgumentError";
import Store from "./Warehouse";
import { getId } from "@/helpers/id";

type GetAllPropsType = {
    filters?: Object;
    storeId: string;
}

type PropsType = {
    expense: ExpenseClientType;
    storeId: string;
}

class Expense {
    static async getAll({ filters, storeId }: GetAllPropsType, { mongoDbConfig, user }: ConfigType) {
        return await mongoDbConfig.collections
            .WAREHOUSES
            .aggregate([
                { $match: { id: storeId } },
                { $unwind: "$expenses" },
                { $unwind: "$expenses.items" },
                {
                    $lookup: {
                        from: "users", // Replace with the name of your external product collection
                        localField: "expenses.user",
                        foreignField: "username",
                        as: "user_info"
                    }
                },
                { $unwind: "$user_info" },
                { $match: { ...(filters ?? {} ) } },
                {
                    $group: {
                        _id: "$expenses.id",
                        createdAt: { $first: "$expenses.createdAt" },
                        category: { $first: "$expenses.category" },
                        id: { $first: "$expenses.id" },
                        items: { $first: "$expenses.items" },
                        status: { $first: "$expenses.status" },
                        total: { $first: "$expenses.total" },
                        user: { 
                            $first: {
                                firstName: "$user_info.firstName",
                                lastName: "$user_info.lastName",
                                username: "$user_info.username"
                            }
                         }
                    }
                }
            ]).toArray() as ExpenseInfoType[];
    }

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
                id: getId(),
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