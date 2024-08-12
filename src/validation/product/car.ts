
import { CAR_ENGINE_TYPE, CAR_TRANSMISSION } from "@/types/product";

// VIN: A 17-character alphanumeric code
const carVINPattern: RegExp = /^[A-HJ-NPR-Z0-9]{17}$/;

// License Plate Number: Alphanumeric, with spaces or hyphens allowed
export const isValidPlateNumber = (value: string) => {
    const pattern: RegExp = /^[A-Za-z0-9 -]{1,10}$/;
    return pattern.test(value)
};
 
export const isValidEngineType =  (value: CAR_ENGINE_TYPE) => Object
    .values(CAR_ENGINE_TYPE)
    .includes(value);

// Engine Number: Alphanumeric, sometimes with dashes
export const isValidEngineNumber = (value: string) => {
    const pattern: RegExp = /^[A-Za-z0-9-]{1,20}$/;
    return pattern.test(value)
};

// Year of Manufacture: A four-digit year
export const isValidYear = (value: string) => {
    const pattern: RegExp = /^(19|20)\d{2}$/;
    return pattern.test(value)
};

/**
 * @param value
 * Validates the car manufacturer name, allowing letters, numbers, and certain special characters (like hyphens).
 * Allows letters, numbers, spaces, and hyphens. This covers most car manufacturer names like "Toyota", "Mercedes-Benz", and "Ford".
 */
export const isValidMake =  (value: string) => {
    const pattern = /^[a-zA-Z0-9\s\-]+$/;
    return pattern.test(value) && Boolean(value.trim())
};

/**
 * Validates the car model name allowing letters, numbers, and certain special characters.
 * e.g., "Camry", "Model 3", "Civic LX".
 * @param value 
 * @returns boolean
 */
export const isValidModel =  (value: string) => {
    const pattern =/^[a-zA-Z0-9\s\-]+$/;
    return pattern.test(value) && Boolean(value.trim())
};

/**
 * Validates the transmission type, ensuring it matches either "Manual" or "Automatic".
 * This restricts the transmission type to either "Manual" or "Automatic", which are the most common types.
 * @param value 
 * @returns 
 */
export const isValidTransmission =  (value: CAR_TRANSMISSION) => Object
    .values(CAR_TRANSMISSION)
    .includes(value);
