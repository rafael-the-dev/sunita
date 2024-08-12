import * as React from "react"

import { defaultInputField } from "@/config/input"
import { isValidDimesions, isValidMaterial } from "@/validation/product/furniture"

export const defaultFunicture = {
    material: { ...defaultInputField },
    dimensions: {
        height: structuredClone(defaultInputField),
        length: structuredClone(defaultInputField),
        width: structuredClone(defaultInputField)
    }
}

export const useFurniture = () => {
    const [ furnicture, setFurniture ] = React.useState(
        () => {
            return defaultFunicture
        }
    )

    const changeDimensions = React.useCallback(
        (prop: "height" | "length" | "width") => (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;

            setFurniture(furnicture => {
                const furnictureClone = structuredClone(furnicture)

                const height = prop === "height" ? value : furnicture.dimensions.height.value;
                const length = prop === "length" ? value : furnicture.dimensions.length.value;
                const width = prop === "width" ? value : furnicture.dimensions.width.value;

                const hasError = !isValidDimesions(length, width, height);

                furnictureClone.dimensions.height.error = hasError;
                furnictureClone.dimensions.length.error = hasError;
                furnictureClone.dimensions.width.error = hasError;

                return {
                    ...furnictureClone,
                    dimensions: {
                        ...furnictureClone.dimensions,
                        [prop]: {
                            error: hasError,
                            helperText: hasError ? "Invalid value": "",
                            value
                        }
                    }
                }
            })
        },
        []
    )

    const changeMaterial = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;

            setFurniture(furnicture => {
                const hasError = !isValidMaterial(value) || !value.trim();

                return {
                    ...furnicture,
                    material: {
                        error: hasError,
                        helperText: hasError ? "Invalid Material": "",
                        value
                    }
                }
            })
        },
        []
    )

    return {
        furnicture,

        //methods
        changeDimensions,
        changeMaterial
    }
}