import { ConfigType } from "@/types/app-config-server";
import { SupplierDBType, SupplierType, SuppliersResponseType } from "@/types/Supplier";
import { STATUS } from "@/types";

import { toISOString } from "@/helpers/date"
import { getId } from "@/helpers/id";
import getSupplierProxy from "../proxy/supplier";
import { retrieveSuppliers, updateSupplier } from "@/helpers/suppliers";

import Error404 from "@/errors/server/404Error";

class Supplier {
    static async getAll({ filters }: { filters?: Object }, config: ConfigType) {
        const suppliersList = await retrieveSuppliers(
            { filters },
            config
        )

        const response: SuppliersResponseType = {
            list: suppliersList
        }

        return response
    }

    static async get({ id, filters }: { id: string, filters?: Object }, config: ConfigType) {
        const innerFilters = filters ?? {}

        innerFilters["suppliers.id"] = id

        const suppliersList = await retrieveSuppliers(
            { 
                filters: innerFilters
            },
            config
        )

        if(suppliersList.length === 0) throw new Error404("Supplier not found")

        return suppliersList[0]
    }

    static async register(supplier: SupplierType, { mongoDbConfig, user }: ConfigType) {
        const storeId = user.stores[0].storeId;
        const id = getId();

        const newSupplier: SupplierDBType = {
            address: null,
            contact: null,
            id,
            name: "",
            nuit: 0,
            status: STATUS.ACTIVE,
            stores: [ storeId ]
        };

        const supplierProxy = getSupplierProxy(newSupplier);

        supplierProxy.address = supplier.address;
        supplierProxy.contact = supplier.contact;
        supplierProxy.name = supplier.name;
        supplierProxy.nuit = supplier.nuit;

        try {
            await mongoDbConfig
                .collections
                .SUPPLIERS
                .insertOne(newSupplier);

            await mongoDbConfig
                .collections
                .WAREHOUSES
                .updateOne(
                    {
                        id: storeId
                    },
                    {
                        $push: {
                            suppliers: {
                                createdAt: toISOString(new Date(Date.now())),
                                id
                            }
                        }
                    }
                )
        } catch(e) {
            await Promise.all(
                [
                    mongoDbConfig
                        .collections
                        .SUPPLIERS
                        .deleteOne(
                            {
                                id
                            }
                        ),
                    mongoDbConfig
                        .collections
                        .WAREHOUSES
                        .updateOne(
                            { id: storeId },
                            {
                                $pull: {
                                    suppliers: {
                                        id
                                    }
                                }
                            }
                        )
                ]
            )

            console.error(e)

            throw e
        }
    }

    static async update(supplier: SupplierType, { mongoDbConfig, user }: ConfigType) {
        const savedSupplier = await this.get(
            {
                id: supplier.id
            },
            {
                mongoDbConfig,
                user
            }
        )

        const storeId = user.stores[0].storeId;

        const updatedSupplier: SupplierDBType = {
            ...savedSupplier,
            stores: [ storeId ]
        };

        const supplierProxy = getSupplierProxy(updatedSupplier);

        supplierProxy.address = supplier.address;
        supplierProxy.contact = supplier.contact;
        supplierProxy.name = supplier.name;
        supplierProxy.nuit = supplier.nuit;

        try {
            await updateSupplier(
                { supplier: updatedSupplier },
                { mongoDbConfig, user }
            )
        } catch(e) {
            await updateSupplier(
                { supplier: savedSupplier },
                { mongoDbConfig, user }
            )

            throw e
        }
    }

}

export default Supplier