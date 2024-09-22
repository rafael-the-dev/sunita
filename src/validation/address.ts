
import { COUNTRIES } from "@/types/address"

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

export const isValidCountry = (country: string) => {
    const countriesList = Object.values(COUNTRIES)

    return country && countriesList.includes(country as COUNTRIES);
}


export const isValidNumber = (value: string) => {
    const pattern = /^[1-9]*$/; 
    
    return (value && pattern.test(value)) 
}

export const isValidState = (state: string) => {
    const stateRegex = /^[A-Za-z\s]{2,50}$/; // Validates states as letters and spaces, 2-50 characters long
    
    return (state && stateRegex.test(state)) 
} 

export const isValidStreet = (street: string) => {
    const streetRegex = /^[A-Za-z0-9\s,.-]{5,100}$/; // Allows alphanumeric characters, spaces, commas, periods, hyphens, 5-100 characters long
    
    return (street && streetRegex.test(street)) 
} 

export const isValidCity = (city: string) => {
    const cityRegex = /^[A-Za-z\s]{2,100}$/; // Allows alphanumeric characters, spaces, commas, periods, hyphens, 2-100 characters long
    
    return (city && cityRegex.test(city)) 
} 