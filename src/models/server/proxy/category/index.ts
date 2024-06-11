
import { CATEGORY_STATUS, CategoryType } from "@/types/category"

import InvalidArgumentError from "@/errors/server/InvalidArgumentError"

const getProxy = (target: CategoryType) => {
    const proxyHandler: ProxyHandler<CategoryType> = {
        set(target: CategoryType, prop: string, newValue: (string | CATEGORY_STATUS), receiver) {
            if(prop === "name") {
                if(!newValue.trim()) throw new InvalidArgumentError("Invalid name of category");
                
                target.name = newValue;

                return true;
            }

            if(prop === "status") {
                if(!Object.values(CATEGORY_STATUS).includes(newValue as CATEGORY_STATUS)) throw new InvalidArgumentError("Invalid status' value.");

                target.status = newValue as CATEGORY_STATUS.INACTIVE;

                return true;
            }

            return false
        },
    }

    return new Proxy(target, proxyHandler)
}

export default getProxy

