
//The house or building number must start with one digit in the range 1-9, and be follwed by zero or more digits
export const isValidAddressNumber = (value: string) => {
    const pattern = /^[1-9][0-9]*$/

    return pattern.test(value)
}


export const isValidAddressStreet = (value: string) => {
    /*const pattern = /^[a-zA-Z1-9](?:\s[a-zA-Z0-9])+$/

    return pattern.test(value)*/

    return Boolean(value.trim())
}