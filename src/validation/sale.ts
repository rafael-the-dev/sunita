import InvalidArgumentError from "@/errors/server/InvalidArgumentError"

import { isInvalidNumber } from "@/helpers/validation"

export const isValidCartTotalPrice = (clientTotalPrice: number, serverTotalPrice: number) => {
    if(isInvalidNumber(serverTotalPrice) || serverTotalPrice !== clientTotalPrice) {
        throw new InvalidArgumentError("Client total price doesn't match with server total price")
    }

    return true;
}

export const isValidReceivedAmount = (totalReceived: number, totalPrice: number) => {
    if(isInvalidNumber(totalReceived) || totalReceived < totalPrice) {
        throw new InvalidArgumentError("Invalid total received amount, or it is less than total price");
    }

    return true;
}