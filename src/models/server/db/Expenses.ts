
import { ConfigType } from "@/types/app-config-server";
import { ExpenseClientType, ExpenseInfoType, ExpenseType, ExpenseStatus } from "@/types/expense";
import { WarehouseType } from "@/types/warehouse";

import { getId } from "@/helpers/id";
import getExpenseProxy from "../proxy/expense"

import ExpenseCategory from "./ExpenseCategory";
import Store from "./Warehouse";
import Error404 from "@/errors/server/404Error";
import { MongoDbConfigType } from "@/types/mongoDb";

type GetAllPropsType = {
    filters?: Object;
    storeId: string;
};

type PropsType = {
    expense: ExpenseClientType;
    storeId: string;
}

type DeletePropsType = {
    expenseId: string;
    storeId: string;
}

type UpdatePropsType = PropsType & {
    expenseId: string;
}


type UpdateStorePropsType = {
    helper: (store: WarehouseType) => ExpenseType[];
    storeId: string;
    
}

class Expense {
    static async getAll({ filters, storeId }: GetAllPropsType, { mongoDbConfig, user }: ConfigType) {
        const expenses = await mongoDbConfig.collections
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
                {
                    $lookup: {
                        from: "expenses-categories", // Replace with the name of your external product collection
                        localField: "expenses.category",
                        foreignField: "id",
                        as: "category_info"
                    }
                },
                { $unwind: "$category_info" },
                { $unwind: "$user_info" },
                { $match: { ...(filters ?? {} ) } },
                {
                    $group: {
                        _id: "$expenses.id",
                        createdAt: { $first: "$expenses.createdAt" },
                        category: { 
                            $first: {
                                id: "$category_info.id",
                                name: "$category_info.name",
                                status:"$category_info.status" 
                            }
                        },
                        id: { $first: "$expenses.id" },
                        items: { $push: "$expenses.items" },
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

        
        return expenses.sort((expenseA, expenseB) => {
            return new Date(expenseB.createdAt).getTime() - new Date(expenseA.createdAt).getTime()
        })
    }

    static async updateStore({ helper, storeId }: UpdateStorePropsType, { mongoDbConfig, user }: ConfigType) {
        await Store.update<ExpenseType[]>(
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

    static async delete({ expenseId, storeId }: DeletePropsType, { mongoDbConfig, user }: ConfigType) {
        const helper = (store: WarehouseType) => {
            let expenses = structuredClone(store.expenses);

            const currentExpense = expenses.find(expense => expense.id === expenseId);

            if(!currentExpense) throw new Error404("Expense not found");

            expenses = expenses.filter(expense => expense.id !== expenseId);

            return expenses;
        };

        await this.updateStore({ helper, storeId }, { mongoDbConfig, user })
    } 

    static async helper(expense: ExpenseType, newExpenseValues: ExpenseClientType, mongoDbConfig: MongoDbConfigType) {
        const expenseProxy = getExpenseProxy(expense)

        expenseProxy.category = newExpenseValues.category;

        expenseProxy.items = newExpenseValues.items;

        expenseProxy.total = newExpenseValues.total;
    }

    static async register({ expense, storeId }: PropsType, { mongoDbConfig, user }: ConfigType) {
        await ExpenseCategory.get({ id: expense.category, storeId }, { mongoDbConfig, user })

        const helper = (store: WarehouseType) => {
            const expenses = structuredClone(store.expenses);

            const newExpense: ExpenseType = {
                category: "",
                createdAt: new Date(Date.now()).toISOString(),
                id: getId(),
                items: [],
                status: ExpenseStatus.SUCCESSFULL,
                total: 0,
                user: "rafaeltivane"
            };

            this.helper(newExpense, expense, mongoDbConfig);

            expenses.push(newExpense);

            return expenses;
        };

        await this.updateStore({ helper, storeId }, { mongoDbConfig, user });
    } 

    static async update({ expense, expenseId, storeId }: UpdatePropsType, { mongoDbConfig, user }: ConfigType) {
        await ExpenseCategory.get({ id: expense.category, storeId }, { mongoDbConfig, user })

        const helper = (store: WarehouseType) => {
            const expenses = structuredClone(store.expenses);

            const currentExpense = expenses.find(expense => expense.id === expenseId);

            if(!currentExpense) throw new Error404("Expense not found");

            this.helper(currentExpense, expense, mongoDbConfig);

            return expenses;
        };

        await this.updateStore({ helper, storeId }, { mongoDbConfig, user });
    } 
}

export default Expense;