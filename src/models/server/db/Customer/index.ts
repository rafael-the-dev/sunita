
import { CustomerType } from "@/types/guest"
import { ConfigType, FiltersType } from "@/types/app-config-server"
import { GuestType, GuestDBType } from "@/types/guest"

import getCustomerProxy from "../../proxy/customer"
import { getId } from "@/helpers/id"
import { getCustomers, getCustomerDetails } from "./helpers"
import { toISOString } from "@/helpers/date"

import Error404 from "@/errors/server/404Error"

class Customer {
    static async getAll({ filters }: { filters?: FiltersType }, config: ConfigType) {
        const customers = await getCustomers(
            {
                filters
            },
            config
        )

        return { list: customers }
    }

    static async get({ filters }: { filters?: FiltersType }, config: ConfigType) {
        const customers = await getCustomers(
            {
                filters
            },
            config
        )

        if(customers.length === 0) throw new Error404("Customer not found.")

        return customers[0]
    }

    static async register(newCustomer: CustomerType, { mongoDbConfig, user }: ConfigType) {
        const  { storeId }  = user.stores[0]
        const customerId = getId()

        const pushCustomerToStore = () => {
            return mongoDbConfig
                .collections
                .WAREHOUSES
                .updateOne(
                    { id: storeId },
                    {
                        $push: {
                            clients: {
                                id: customerId,
                                createdAt: toISOString(Date.now())
                            }
                        }
                    }
                )
        }

        const customer: CustomerType = getCustomerDetails({ ...newCustomer, id: customerId });

        /*try {
            const customer = await this.get(
                { 
                    filter: {
                        "document.number": document.number,
                        "document.type": document.type
                    }
                },
                { 
                    mongoDbConfig, user 
                }
            )

            const store = guest.stores.find(store => store.id === storeId);

            //if store was found, exit register function
            if(store) return;

            //if store was not found, append current store to Guest.stores
            return await mongoDbConfig
                .collections
                .GUESTS
                .updateOne(
                    { "document.number": document.number },
                    {
                        $push: {
                            stores: {
                                createdAt: new Date(Date.now()).toISOString(),
                                id: storeId
                            }
                        }
                    }
                )
        } catch(e) {
            //continue with the followind code, if store was not found in the catch block
        }*/

       try {
            await mongoDbConfig
                .collections
                .CUSTOMERS
                .insertOne(customer);

            await pushCustomerToStore();
            
       } catch(e) {
            await mongoDbConfig
                .collections
                .CUSTOMERS
                .deleteOne(
                    {
                        id: customerId
                    }
                );

            await mongoDbConfig
                .collections
                .WAREHOUSES
                .updateOne(
                    { id: storeId },
                    {
                        $pull: {
                            clients: {
                                id: customerId
                            }
                        }
                    }
                )

            throw e;
       }
    }

    static async update(customerDetails: CustomerType, { mongoDbConfig, user }: ConfigType) {
        const customer: CustomerType = getCustomerDetails(customerDetails);

        const currentCustomerInfo = await this.get(
            {
                filters: {
                    id: customerDetails.id,
                    "document.number": customerDetails.document.number,
                    "document.type": customerDetails.document.type
                }
            },
            {
                mongoDbConfig,
                user
            }
        )

        const updateCustomer = (customer: CustomerType) => {
            //@ts-ignore
            const { _id, ...customerDetails } = customer

            return mongoDbConfig
                .collections
                .CUSTOMERS
                .updateOne(
                    { id: customerDetails.id },
                    {
                        $set: customerDetails
                    }
                )
        }

        try {
            await updateCustomer(customer);   
        } catch(e) {
            await updateCustomer(currentCustomerInfo)

            throw e;
       }
    }
}

export default Customer