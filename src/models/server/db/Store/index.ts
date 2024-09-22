
import { ConfigType, FiltersType } from "@/types/app-config-server"
import { EnrollStoreType, StoreType } from "@/types/warehouse"
import { BaseFeeType, FEES_TYPE } from "@/types/fees"
import { STATUS } from "@/types"

import { FetchResponseType } from "@/types"
import { getId } from "@/helpers/id"
import getStoreProxy from "./proxy"
import { getStores } from "./helpers/db"

import FeesModel from "../Fees"
import UsersModel from "../Users"

import InvalidArgumentError from "@/errors/server/InvalidArgumentError"


class Store {
    static async getAll(filters: FiltersType, config: ConfigType) {
        const stores = await getStores(filters, config)

        return {
            data: stores
        }
    }

    static async register(store: EnrollStoreType, config: ConfigType) {
        if(!store || typeof store !== "object") throw new InvalidArgumentError("Invalid store details")

        const id = getId()

        const enrollStore: EnrollStoreType = {
            address: null,
            contact: null,
            id,
            name: null,
            payment: null,
            users: [],
            status: STATUS.INACTIVE
        }

        const storeProxy = getStoreProxy(enrollStore)

        storeProxy.address = store.address
        storeProxy.contact = store.contact
        storeProxy.name = store.name

        const newFee: BaseFeeType = {
            price: 0,
            payment: store.payment,
            storeId: config.user.stores[0].storeId,
            total: 0,
            type: FEES_TYPE.ENROLLMENT
        }

        await FeesModel.register(newFee, config)

        if(!store.users || !Array.isArray(store.users) || store.users.length !== 1) throw new InvalidArgumentError("Admin details not provided.")
        
        config.user.stores[0].storeId = id

        await UsersModel.register(store.users[0], config)

        try {
            const newStore: StoreType = {
                address: storeProxy.address,
                contact: storeProxy.contact,
                clients: [],
                expenses: [],
                "expenses-categories": [],
                id,
                name: storeProxy.name,
                products: [],
                rooms: [],
                "rooms-booking": [],
                sales: [],
                suppliers: [],
                "stock-reports": [],
                users: [],
                "unpaid-sales": [],
                status: STATUS.ACTIVE
            }

            await config
                .mongoDbConfig
                .collections
                .WAREHOUSES
                .insertOne(newStore)
        } catch(e) {
            await config
                .mongoDbConfig
                .collections
                .WAREHOUSES
                .deleteOne({ id })
                
            throw e
        }
    }
}

export default Store