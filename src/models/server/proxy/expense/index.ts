
import currency from "currency.js"

import { ExpenseItemType, ExpenseStatus, ExpenseType } from "@/types/expense"

import InvalidArgumentError from "@/errors/server/InvalidArgumentError"

const getProxy = (target: ExpenseType) => {

    const proxyHandler = {
        set(obj: ExpenseType, prop: string, newValue) {
            switch(prop) {
                case "category": {
                    return Reflect.set(obj, prop, newValue);
                }
                case "items": {
                    const items = newValue as ExpenseItemType[];

                    const total = items.reduce((prevValue, currentItem) => {
                        return currency(currentItem.price).add(prevValue).value;
                    }, 0);

                    Reflect.set(obj, "total", total);
                    
                    return Reflect.set(obj, prop, items);
                }
                case "status": {
                    const status = newValue as ExpenseStatus;

                    if(!Object.values(ExpenseStatus).includes(status)) throw new InvalidArgumentError("Invalid expense status");

                    return Reflect.set(obj, prop, status);
                }
                case "total": {
                    const total = newValue as number;
        
                    if(obj.total !== total) throw new InvalidArgumentError("Total price is not correct");

                    return Reflect.set(obj, prop, total);
                }
            }

            return false
        }
    }

    return new Proxy(target, proxyHandler)
}

export default getProxy