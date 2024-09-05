import { NextRequest, NextResponse } from "next/server"
import currency from "currency.js"

import { apiHandler } from "@/middlewares/route-handler"

import Properties from "@/models/server/db/Property"

type PriceKey = "all" | "daily" | "hourly"

const getPriceKeyValue = (key: PriceKey, min: string, max: string) => {
    return {
        [`price.${key}`]: {
            $gte: currency(min).value,
            $lte: currency(max).value
        }
    }
}

const getPriceFilters = (key: PriceKey, min: string, max: string) => {
    if([ "daily", "hourly" ].includes(key)) {
        return [
            getPriceKeyValue(key, min, max)
        ]
    }
    else {
        return [
            getPriceKeyValue("daily", min, max),
            getPriceKeyValue("hourly", min, max)
        ]
    }
}

export const GET = (req: NextRequest) => {
    const params = new URLSearchParams(req.nextUrl.search)

    const amenities = params.getAll("amenities")
    const minPrice = params.get("min-price")
    const maxPrice = params.get("max-price")
    const propertyType = params.get("type")
    const pricingType = params.get("pricing-type") as PriceKey

    return apiHandler(
        req,
        async ({ mongoDbConfig, user }) => {
            const properties = await Properties.getAll(
                { 
                    filter: {
                       ...( amenities.length > 0 ? { amenities: { $in: amenities } }: {}),
                       ...( propertyType ? { type: propertyType }: {}),
                       $or: getPriceFilters(pricingType ?? "all" , minPrice ?? "0", maxPrice ?? "1000")
                    }
                },
                { 
                    mongoDbConfig, 
                    user 
                }
            )

            return NextResponse.json(properties)
        }
    )
}