
import { CustomerType } from "@/types/guest"
import { ConfigType, FiltersType } from "@/types/app-config-server"
import { GuestType, GuestDBType } from "@/types/guest"

import getCustomerProxy from "../../proxy/customer"
import { getId } from "@/helpers/id"
import { getCustomers, getCustomerDetails } from "./helpers"
import { toISOString } from "@/helpers/date"

import Error404 from "@/errors/server/404Error"
import InvalidArgumentError from "@/errors/server/InvalidArgumentError"

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

        //This is a helper method that appends customer's details to store.clients array
        const pushCustomerToStore = (id: string) => {
            return mongoDbConfig
                .collections
                .WAREHOUSES
                .updateOne(
                    { id: storeId },
                    {
                        $push: {
                            clients: {
                                id,
                                createdAt: toISOString(Date.now())
                            }
                        }
                    }
                )
        }

        const customer: CustomerType = getCustomerDetails({ ...newCustomer, id: customerId });

        //Retrieve customer's details from CLIENTS table
        const customerDetailsInDB = await mongoDbConfig
            .collections
            .CUSTOMERS
            .findOne(
                {
                    "document.number": newCustomer.document.number,
                    "document.type": newCustomer.document.type
                }
            );

        //If customer is already registered in the system, check if It is also in the current store
        if(customerDetailsInDB) {
            const customerInStore = await mongoDbConfig
                .collections
                .WAREHOUSES
                .findOne(
                    {
                        "clients.id": customerDetailsInDB.id,
                        id: storeId,
                    }
                );
           
            //If customer if already registered in current store, throw an error and leave
            if(customerInStore) throw new InvalidArgumentError("Client already registered, or check document type and number.");
            
            //If customer is not in current store, append his details to store.clients, then leave
            await pushCustomerToStore(customerDetailsInDB.id);
            return;
        } else {
            //Register customer, If he is not alredy registered
            try {
                 await mongoDbConfig
                     .collections
                     .CUSTOMERS
                     .insertOne(customer);
     
                 await pushCustomerToStore(customerId);
                 
            } catch(e) {
                // delete customer when an error occurs
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