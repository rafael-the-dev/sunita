
import { ConfigType, FiltersType } from "@/types/app-config-server"
import { CustomerInfoType, CustomerType } from "@/types/guest"

import getCustomerProxy from "../../../proxy/customer"

export const getCustomers = async ({ filters }: { filters?: FiltersType }, { mongoDbConfig, user }: ConfigType) => {
    const id = user.stores[0].storeId

    const customers = await mongoDbConfig
        .collections
        .WAREHOUSES
        .aggregate(
            [
                {
                    $match: { id }
                },
                {
                    $lookup: {
                        from: "clients",
                        foreignField: "id",
                        localField: "clients.id",
                        as: "customerInfo"
                    }
                },
                {
                    $unwind: "$customerInfo"
                },
                {
                    $project: {
                        _id: "$custommerInfo.id",
                        contact: "$customerInfo.contact" ,
                        document: "$customerInfo.document" ,
                        firstName: "$customerInfo.firstName" ,
                        id: "$customerInfo.id",
                        lastName: "$customerInfo.lastName" 
                    }
                }
            ]
        )
        .toArray() as CustomerInfoType[]

    return customers
}

export const getCustomerDetails = ({ contact, document, firstName, id, lastName }: CustomerType) => {
    const customer: CustomerType = {
        contact: null,
        document: null,
        firstName: null,
        id: id,
        lastName: null
    }

    const customerProxy  = getCustomerProxy(customer)
    
    customerProxy.contact = contact
    customerProxy.document = document;
    customerProxy.firstName = firstName;
    customerProxy.lastName = lastName;

    return customer
}