
import { CustomerType } from "@/types/guest"
import { ConfigType } from "@/types/app-config-server"
import { GuestType, GuestDBType } from "@/types/guest"

import getCustomerProxy from "../../proxy/customer"
import { getId } from "@/helpers/id"
import { toISOString } from "@/helpers/date"

import Error404 from "@/errors/server/404Error"

class Customer {
    static async register({ contact, document, firstName, lastName }: CustomerType, { mongoDbConfig, user }: ConfigType) {
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

        /*try {
            const guest = await this.get(
                { 
                    filter: {
                        "document.number": document.number
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

        const customer: CustomerType = {
            contact: null,
            document: null,
            firstName: null,
            id: customerId,
            lastName: null
        }

        const customerProxy  = getCustomerProxy(customer)
        
        customerProxy.contact = contact
        customerProxy.document = document;
        customerProxy.firstName = firstName;
        customerProxy.lastName = lastName;

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
                        "document.number": document.number
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

export default Customer