
import { CAR_ENGINE_TYPE, CAR_TRANSMISSION, PRODUCTS_CATEGORIES, ProductInfoType } from "@/types/product"

import { defaultInputField } from "@/config/input"

const getInitialValues = (value?: string) => structuredClone({ ...defaultInputField, value: value ?? "" })

export const getDefaultCar = (product?: ProductInfoType) => (
    {
        color: getInitialValues(product?.car?.color),
        engine: {
            number: getInitialValues(product?.car?.engine?.horsepower?.toString()),
            type: { ...defaultInputField, value: product?.car?.engine?.type ?? CAR_ENGINE_TYPE.DIESEL }
        },
        make: getInitialValues(product?.car?.make),
        model: getInitialValues(product?.car?.model),
        transmission: { ...defaultInputField, value: product?.car?.transmission ?? CAR_TRANSMISSION.AUTOMATIC },
        year: getInitialValues(product?.car?.year?.toString()),
    }
)

export const getDefaultExpirableProduct = (product?: ProductInfoType) => (
    {
        expirationDate: getInitialValues(product?.expirable?.expirationDate),
        manufactureDate: getInitialValues(product?.expirable?.manufactureDate)
    }  
)

export const getFurnicture = (product?: ProductInfoType) => (
    {
        material: getInitialValues(product?.furnicture?.material),
        dimensions: {
            height: getInitialValues(product?.furnicture?.dimensions?.height?.toString()),
            length: getInitialValues(product?.furnicture?.dimensions?.length?.toString()),
            width: getInitialValues(product?.furnicture?.dimensions?.width?.toString())
        }
    }
)

export const getDefaultProduct = (product?: ProductInfoType) => (
    {
        barcode: getInitialValues(product?.barcode),
        category: { ...defaultInputField, value: product?.category ?? PRODUCTS_CATEGORIES.EXPIRABLE },
        color: structuredClone(defaultInputField ),
        description: getInitialValues(""),
        name: getInitialValues(product?.name),
        price: {
            purchase: getInitialValues(product?.purchasePrice?.toString()),
            sell: getInitialValues(product?.sellPrice?.toString())
        }
    }
)

export const getDefaultProductValues = (product?: ProductInfoType) => (
    {
        ...getDefaultProduct(product),
        car: getDefaultCar(product),
        expirable: getDefaultExpirableProduct(product),
        furnicture: getFurnicture(product)
    }
)


export const defaultInput = getDefaultProductValues()