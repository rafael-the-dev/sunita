import { NextRequest, NextResponse } from "next/server";

import { URLParamsType } from "@/types/app-config-server";
import { PropertyType } from "@/types/property";

import { apiHandler } from "@/middlewares/route-handler";

import Properties from "@/models/server/db/Property";

export const GET = (req: NextRequest, { params: { propertyId, storeId } }: URLParamsType) => {
    return apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            const room = await Properties.get(
                { 
                    filter: {
                        id: propertyId,
                        "owner": storeId
                    } 
                },
                { 
                    mongoDbConfig, 
                    user 
                }
            )

            return NextResponse.json(room)
        }
    )
}

export const PUT = (req: NextRequest, { params: { propertyId } }: URLParamsType) => {
    return apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            const property = await req.json() as PropertyType;

            await Properties.upddate(
                { 
                    ...property, 
                    id: propertyId 
                }, 
                { 
                    mongoDbConfig, 
                    user 
                }
            );

            return NextResponse.json({ message: "Room was successfully updated" });
        }
    )
}