
import { CustomerType } from "@/types/guest"
import { ConfigType, FiltersType } from "@/types/app-config-server"
import { GuestType, GuestDBType } from "@/types/guest"

import { getId } from "@/helpers/id"
import { getCustomers, getCustomerDetails } from "./helpers"
import { toISOString } from "@/helpers/date"

import Error404 from "@/errors/server/404Error"
import InvalidArgumentError from "@/errors/server/InvalidArgumentError"

type TableNameType = "CUSTOMERS" | "GUESTS"

type RetrieveCustomersType = { 
    filters?: FiltersType, 
    tableName: TableNameType 
}

const getFieldName = (tableName: TableNameType) => tableName === "CUSTOMERS" ? "clients" : "guests"

class Customer {
    static async getAll({ filters, tableName }: RetrieveCustomersType, config: ConfigType) {
        const customers = await getCustomers(
            {
                filters,
                tableName: getFieldName(tableName)
            },
            config
        )

        return { list: customers }
    }

    static async get({ filters, tableName }: RetrieveCustomersType, config: ConfigType) {
        const customers = await getCustomers(
            {
                filters,
                tableName: getFieldName(tableName)
            },
            config
        )

        if(customers.length === 0) throw new Error404("Customer not found.")

        return customers[0]
    }

    static async register(newCustomer: CustomerType, tableName: TableNameType, { mongoDbConfig, user }: ConfigType) {
        const  { storeId }  = user.stores[0]
        const customerId = getId()

        const fieldName = getFieldName(tableName)

        //This is a helper method that appends customer's details to store.clients array
        const pushCustomerToStore = (id: string) => {
            return mongoDbConfig
                .collections
                .WAREHOUSES
                .updateOne(
                    { id: storeId },
                    {
                        $push: {
                            [fieldName]: {
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
            [tableName]
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
                        [`${fieldName}.id`]: customerDetailsInDB.id,
                        id: storeId,
                    }
                );
           
            //If customer if already registered in current store, throw an error and exit
            if(customerInStore && tableName === "CUSTOMERS") {
                throw new InvalidArgumentError("Client already registered, or check document type and number.");
            }

            //If guest if already registered in current store, exit
            if(customerInStore && tableName === "GUESTS") return;
            
            //If customer is not in current store, append his details to store.clients, then exit
            await pushCustomerToStore(customerDetailsInDB.id);
            return;
        } else {
            //Register customer, If he is not already registered
            try {
                await mongoDbConfig
                    .collections
                    [tableName]
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
                                [fieldName]: {
                                    id: customerId
                                }
                            }
                        }
                    )
    
                throw e;
            }
        }
    }

    static async update(customerDetails: CustomerType, tableName: TableNameType, { mongoDbConfig, user }: ConfigType) {
        const customer: CustomerType = getCustomerDetails(customerDetails);

        const currentCustomerInfo = await this.get(
            {
                filters: {
                    id: customerDetails.id,
                    "document.number": customerDetails.document.number,
                    "document.type": customerDetails.document.type
                },
                tableName
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
                [tableName]
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