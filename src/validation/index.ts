import InvalidArgumentError from "@/errors/server/InvalidArgumentError"

export const validate = (value: string, errorMessage: string, fn: (value: string | Date) => boolean) => {
    if(!fn(value)) {
        throw new InvalidArgumentError(errorMessage)
    }
}