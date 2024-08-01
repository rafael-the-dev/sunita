import { ConfigType } from "@/types/app-config-server";
import { SupplierDBType, SupplierType, SuppliersResponseType } from "@/types/Supplier";
import { STATUS } from "@/types";

import { toISOString } from "@/helpers/date"
import { getId } from "@/helpers/id";
import getSupplierProxy from "../proxy/supplier";

class Supplier {
    static async getAll({ filters }: { filters?: Object }, { mongoDbConfig, user }: ConfigType) {
        const id = user.stores[0].storeId;

        try {
        const suppliersList = await mongoDbConfig
            .collections
            .WAREHOUSES
            .aggregate(
                [
                    { 
                        $match: { id }
                    },
                    {
                        $match: filters ?? {}
                    },
                    {
                        $lookup: {
                            from: "suppliers",
                            foreignField: "id",
                            localField: "suppliers.id",
                            as: "suppliersList"
                        }
                    },
                    {
                        $unwind: "$suppliersList"
                    },
                    {
                        $group: {
                            _id: "$suppliersList.id",
                            address: { $first: "$suppliersList.address" },
                            contact: { $first: "$suppliersList.contact"},
                            id: { $first: "$suppliersList.id" },
                            name: { $first: "$suppliersList.name" },
                            nuit: { $first: "$suppliersList.nuit" },
                            status: { $first: "$suppliersList.status" }
                        }
                    }
                ]
            )
            .toArray() as SupplierType[]

            const response: SuppliersResponseType = {
                list: suppliersList
            }

            return response
        } catch(e) {
            console.error(e)
            return []
        }
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
}

export default Supplier