import { ConfigType } from "@/types/app-config-server"
import { CATEGORY_STATUS, CategoryType } from "@/types/category"

import { getId } from "@/helpers/id"
import getCategoryProxy from "../proxy/category"

import Error404 from "@/errors/server/404Error"

import Store from "./Warehouse"

type UpdatePropsType = CategoryType & {
    storeId: string
}

class ExpenseCategory {
    static async getAll({ status, storeId }: { status: CATEGORY_STATUS, storeId: string }, { mongoDbConfig, user }: ConfigType) {
        const store = await mongoDbConfig.collections.WAREHOUSES.findOne({ id: storeId })

        if(!status) return store["expenses-categories"]

        return store["expenses-categories"].filter(category => category.status === status)
    }

    static async add({ name, storeId }: { name: string, storeId: string }, { mongoDbConfig, user }: ConfigType) {
        const category: CategoryType = {
            id: getId(),
            name: "",
            status: CATEGORY_STATUS.ACTIVE
        } 

        await Store.update<CategoryType[]>({
            helper(store) {
                const categories = structuredClone(store["expenses-categories"])

                const categoryProxy = getCategoryProxy(category);

                categoryProxy.name = name;

                categories.push(category)

                return categories
            },
            id: storeId,
            key: "expenses-categories"
        }, { mongoDbConfig, user })
    }

    static async update({ id, name, status, storeId }: UpdatePropsType, { mongoDbConfig, user }: ConfigType) {
        await Store.update<CategoryType[]>({
            helper(store) {
                const categories = structuredClone(store["expenses-categories"]);

                const category = categories.find(item => item.id === id);

                if(!category) throw new Error404("Category not found.");

                const categoryProxy = getCategoryProxy(category);

                categoryProxy.name = name;

                categoryProxy.status = status;

                return categories;
            },
            id: storeId,
            key: "expenses-categories"
        }, { mongoDbConfig, user })
    }
}

export default ExpenseCategory