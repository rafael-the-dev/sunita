

export const isValidNUIT = (value: string) => {
    const pattern = /^[0-9]{9}$/

    return pattern.test(value)
}