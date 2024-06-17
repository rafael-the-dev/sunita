import moment from "moment"

import { StockClientRequestBodyType, StockClientRequestItemType, StockReportType } from "@/types/stock"

import { isValidDate, isValidPrice, isValidReference, validateAndGetTotalPrice } from "@/helpers/stock-report"
import { WarehouseType } from "@/types/warehouse"
import currency from "currency.js"
import InvalidArgumentError from "@/errors/server/InvalidArgumentError"

type PropType = "createdAt" | "items" | "reference" | "total"

const getStockProxy = (target: StockReportType) => {

    const proxyHandler = {
        get(target: StockReportType, prop: string, receiver) {
            const value = Reflect.get(target, prop, receiver);

            if (typeof value === 'object' && value !== null) {
                return new Proxy(value, this); // Return a proxy for nested objects
            }

            return value;
        },
        set(obj: StockReportType, prop: PropType, newValue: any) {
            switch(prop) {
                case "createdAt": {
                    const date = moment(newValue)
                    //check if date is not greater than current date, Date.now()
                    isValidDate(date);

                    return Reflect.set(obj, prop, date.toISOString())
                }
                case "items": {
                    const items = newValue as StockClientRequestItemType[]
                    const total = validateAndGetTotalPrice(items)

                    Reflect.set(obj, "total", total)

                    return Reflect.set(obj, prop, items)
                }
                case "reference": {
                    //throw an InvalidArgumentError if reference is invalid
                    isValidReference(null, newValue as string);

                    return Reflect.set(obj, prop, newValue)
                }
                case "total": {
                    const total = currency(newValue).value

                    if(total !== obj.total) throw new InvalidArgumentError("Invalid total price")

                    return Reflect.set(obj, prop, total)
                }
            }

            return false
        }
    }

    return new Proxy(target, proxyHandler)
}

export default getStockProxy