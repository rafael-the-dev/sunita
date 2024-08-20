
/*import { ConfigType } from "@/types/app-config-server"
import { GuestType, GuestDBType } from "@/types/guest"

import getGuestProxy from "../proxy/guest"

import Error404 from "@/errors/server/404Error"

class Guest {
    static async get({ filter }: { filter: Object }, { mongoDbConfig, user }: ConfigType) {
        /*const guest = await mongoDbConfig
            .collections
            .GUESTS
            .findOne(
                filter
            ) as GuestDBType;

        if(!guest) throw new Error404("Guest not found");

        return guest;
    }

    static async register({ document, firstName, lastName }: GuestType, { mongoDbConfig, user }: ConfigType) {
        const  { storeId }  = user.stores[0]

        try {
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
        }

        const guest: GuestDBType = {
            document: null,
            firstName: null,
            lastName: null,
            stores: [
                {
                    createdAt: new Date(Date.now()).toISOString(),
                    id: storeId
                }
            ]
        }

        const guestProxy  = getGuestProxy(guest)

        guestProxy.document = document;
        guestProxy.firstName = firstName;
        guestProxy.lastName = lastName;

       try {
            await mongoDbConfig
                .collections
                .GUESTS
                .insertOne(guest)
       } catch(e) {
            await mongoDbConfig
                .collections
                .GUESTS
                .deleteOne(
                    {
                        "document.number": document.number
                    }
                );

            throw e;
       }
    }
}

export default Guest*/