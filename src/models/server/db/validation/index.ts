
import InvalidArgumentError from "@/errors/server/InvalidArgumentError"

export const validateArray = (key: string, list: Object) => {
    if(!list || !Array.isArray(list)) throw new InvalidArgumentError(`Invalid ${key}`)
}

export const validateObject = (key: string, obj: Object) => {
    if(!obj || typeof obj !== "object") throw new InvalidArgumentError(`Invalid ${key}`)
}