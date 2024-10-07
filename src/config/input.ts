
export const defaultInputField = {
    error: false,
    helperText: "",
    value: ""
}

export const getInputFieldObject = (value: string) => {
    return {
        error: false,
        helperText: "",
        value: Boolean(value) ? value : ""
    }
}