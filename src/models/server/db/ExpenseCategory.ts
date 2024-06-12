import { ConfigType } from "@/types/app-config-server"
import { CATEGORY_STATUS, CategoryType } from "@/types/category"

import { getId } from "@/helpers/id"
import getCategoryProxy from "../proxy/category"

import Error404 from "@/errors/server/404Error"

type UpdatePropsType = CategoryType & {
    storeId: string
}

class ExpenseCategory {
    static async get({ id, storeId }: { id: string, status?: CATEGORY_STATUS, storeId: string }, { mongoDbConfig, user }: ConfigType) {
        const category = await mongoDbConfig
            .collections
            .EXPENSES_CATEGORIES
            .findOne({ id })

        if(!category) throw new Error404("Category not found")

        return category
    }

    static async getAll({ status, storeId }: { status?: CATEGORY_STATUS, storeId: string }, { mongoDbConfig, user }: ConfigType) {
        const list = await mongoDbConfig
            .collections
            .EXPENSES_CATEGORIES
            .find(status ? { status } : {})
            .toArray();

        return list
    }

    static async add({ name, storeId }: { name: string, storeId: string }, { mongoDbConfig, user }: ConfigType) {
        const category: CategoryType = {
            id: getId(),
            name: "",
            status: CATEGORY_STATUS.ACTIVE
        } 

        const categoryProxy = getCategoryProxy(category);

        categoryProxy.name = name;

        await mongoDbConfig
            .collections
            .EXPENSES_CATEGORIES
            .insertOne(category)
    }

    static async update({ id, name, status, storeId }: UpdatePropsType, { mongoDbConfig, user }: ConfigType) {
        const collection = mongoDbConfig.collections.EXPENSES_CATEGORIES

        const category = await collection.findOne({ id })

        if(!category) throw new Error404("Category not found.");

        const categoryProxy = getCategoryProxy(category);

        categoryProxy.name = name;

        categoryProxy.status = status;

        await collection.updateOne({ id }, { $set: { ...category } })
    }
}

export default ExpenseCategory