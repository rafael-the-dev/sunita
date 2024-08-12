
import { CAR_ENGINE_TYPE, CAR_TRANSMISSION, PRODUCTS_CATEGORIES } from "@/types/product"

import { defaultInputField } from "@/config/input"

export const defaultCar = {
    color: structuredClone(defaultInputField),
    engine: {
        number: structuredClone(defaultInputField),
        type: { ...defaultInputField, value: CAR_ENGINE_TYPE.DIESEL }
    },
    make: structuredClone(defaultInputField),
    model: structuredClone(defaultInputField),
    transmission: { ...defaultInputField, value: CAR_TRANSMISSION.AUTOMATIC },
    year: structuredClone(defaultInputField),
}

export const defaultExpirableProduct = {
    barcode: structuredClone(defaultInputField),
    expirationDate: structuredClone(defaultInputField),
    manufactureDate: structuredClone(defaultInputField)
}  

export const defaultFurnicture = {
    material: { ...defaultInputField },
    dimensions: {
        height: structuredClone(defaultInputField),
        length: structuredClone(defaultInputField),
        width: structuredClone(defaultInputField)
    }
}

export const defaultProduct = {
    category: { ...defaultInputField, value: PRODUCTS_CATEGORIES.EXPIRABLE },
    color: structuredClone(defaultInputField ),
    description: structuredClone(defaultInputField ),
    name: structuredClone(defaultInputField ),
    price: {
        purchase: structuredClone(defaultInputField),
        sell: structuredClone(defaultInputField)
    }
}


export const defaultInput = {
    ...defaultProduct,
    car: defaultCar,
    expirable: defaultExpirableProduct,
    furnicture: defaultFurnicture
}