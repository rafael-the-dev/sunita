import { Collection } from "mongodb"

import { CATEGORY_STATUS, CategoryType } from "@/types/category"

import { getId } from "@/helpers/id"
import getCategoryProxy from "../proxy/category"

import Error404 from "@/errors/server/404Error"

type UpdatePropsType = CategoryType & {
    storeId: string
}

type ConfigType = {
    collection: Collection<CategoryType>
}

class ProductCategory {
    static async get<T>({ id, storeId }: { id: string, status?: CATEGORY_STATUS, storeId: string }, { collection  }: ConfigType) {
        const category = await collection.findOne({ id })

        if(!category) throw new Error404("Category not found")

        return category
    }

    static async getAll({ status, storeId }: { status?: CATEGORY_STATUS, storeId: string }, { collection }: ConfigType) {
        const list = await collection
            .find(status ? { status } : {})
            .toArray();

        return list
    }

    static async add({ name, storeId }: { name: string, storeId: string }, { collection }: ConfigType) {
        const category: CategoryType = {
            id: getId(),
            name: "",
            status: CATEGORY_STATUS.ACTIVE
        } 

        const categoryProxy = getCategoryProxy(category);

        categoryProxy.name = name;

        await collection.insertOne(category)
    }

    static async update({ id, name, status, storeId }: UpdatePropsType, { collection }: ConfigType) {
        const category = await collection.findOne({ id })

        if(!category) throw new Error404("Category not found.");

        const categoryProxy = getCategoryProxy(category);

        categoryProxy.name = name;

        categoryProxy.status = status;

        await collection.updateOne({ id }, { $set: { ...category } })
    }
}

export default ProductCategory