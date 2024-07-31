
export const isValidAddressNumber = (value: string) => {
    const pattern = /^[1-9]+$/

    return pattern.test(value)
}


export const isValidAddressStreet = (value: string) => {
    const pattern = /^[a-zA-Z1-9](?:\s[a-zA-Z0-9])+$/

    return pattern.test(value)
}