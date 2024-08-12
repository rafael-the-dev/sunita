import currency from "currency.js";
import moment from "moment"

import { PRODUCTS_CATEGORIES } from "@/types/product";

export const isValidBestBefore = (date: string, manufactureDate: string) => {
    const bestBefore = moment(date);
    const isValid = bestBefore.isValid();

    if(!isValid) return false;

    const manufacturedDate = moment(manufactureDate)

    const isAfterManufactureDate = bestBefore.isAfter(manufacturedDate);
    const isAfterToday = bestBefore.isAfter(moment(moment.now()));

    return isAfterManufactureDate && isAfterToday;
}

export const isValidManufactureDate = (date: string, bestBefore: string) => {
    const manufactureDate = moment(date);
    const isValid = manufactureDate.isValid();

    if(!isValid) return false;

    const isBeforeBestBefore = manufactureDate.isBefore(moment(bestBefore));

    return isBeforeBestBefore;
}


/**
 * 
 * @param value - Product.PRODUCTS_CATEGORIES
 * @returns boolean
 */
export const isValidCategory = (value: PRODUCTS_CATEGORIES) => Object
    .values(PRODUCTS_CATEGORIES)
    .includes(value);

/**
 * This supports either a 3 or 6 character hexadecimal color code (e.g., #FFF, #FFFFFF) or common color names (e.g., "Red", "Blue").
 * @param value 
 * @returns boolean
 */
export const isValidColor = (value: string) => {
    const pattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^[a-zA-Z]+$/;
    return pattern.test(value)
}

// Product Name: Letters, numbers, and spaces allowed, but no special characters.
export const isValidName = (value: string) => {
    const pattern: RegExp = /^[A-Za-z0-9 ]{1,50}$/;
    return pattern.test(value)
}

// Expiration Date: Format YYYY-MM-DD
export const isValidDate = (value: string) => {
    const pattern: RegExp = /^\d{4}-\d{2}-\d{2}$/;
    return pattern.test(value)
}

// Batch Number: Alphanumeric with optional dashes or underscores
const batchNumberPattern: RegExp = /^[A-Za-z0-9-_]{1,20}$/;

// Quantity: Positive integers only
export const isValidQuantity = (value: string) => {
    const pattern: RegExp = /^[1-9]\d*$/;
    return pattern.test(value)
}

// Price: Positive decimal number, up to two decimal places
export const isValidPrice = (value: string) => {
    const pattern: RegExp = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    return pattern.test(value)
}

export const isValidPurchasePrice = (value: string, sellPrice: number) => {
    if(Number.isNaN(value)) return false;

    const isValid = isValidPrice(value);

    if(!isValid) return false;

    const purchasePrice = currency(value).value;

    const isGreaterThanSellPrice = purchasePrice > sellPrice;
    
    return !isGreaterThanSellPrice;
};

export const isValidSellPrice = (value: string, purchasePrice: number) => {
    if(Number.isNaN(value)) return false;

    const isValid = isValidPrice(value.toString());

    if(!isValid) return false;

    const sellPrice = currency(value).value;

    const isLessThanPurchasePrice = sellPrice < purchasePrice;
    
    return  !isLessThanPurchasePrice;
};