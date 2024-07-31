import { ConfigType } from "@/types/app-config-server";
import { SupplierDBType, SupplierType } from "@/types/Supplier";
import { STATUS } from "@/types";

import { toISOString } from "@/helpers/date"
import { getId } from "@/helpers/id";
import getSupplierProxy from "../proxy/supplier";

class Supplier {

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