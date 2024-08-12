import * as React from "react"

import { ProductInputsType } from "../types"

import { isValidDimesions, isValidMaterial } from "@/validation/product/furniture"

const useFurniture = (setInput: React.Dispatch<React.SetStateAction<ProductInputsType>>) => {
    const changeDimensions = React.useCallback(
        (prop: "height" | "length" | "width") => (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;

            setInput(input => {
                const inputClone = { ...input }
                const furnictureClone = inputClone.furnicture

                const height = prop === "height" ? value : furnictureClone.dimensions.height.value;
                const length = prop === "length" ? value : furnictureClone.dimensions.length.value;
                const width = prop === "width" ? value : furnictureClone.dimensions.width.value;

                const hasError = !isValidDimesions(length, width, height);

                furnictureClone.dimensions.height.error = hasError;
                furnictureClone.dimensions.length.error = hasError;
                furnictureClone.dimensions.width.error = hasError;

                furnictureClone.dimensions = {
                    ...furnictureClone.dimensions,
                    [prop]: {
                        error: hasError,
                        helperText: hasError ? "Invalid value": "",
                        value
                    }
                }

                return inputClone
            })
        },
        [ setInput ]
    )

    const changeMaterial = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;

            setInput(input => {
                const inputClone = { ...input }

                const hasError = !isValidMaterial(value) || !value.trim();

                inputClone.furnicture.material = {
                    error: hasError,
                    helperText: hasError ? "Invalid Material": "",
                    value
                }

                return inputClone
            })
        },
        [ setInput ]
    )

    return {
        changeDimensions,
        changeMaterial
    }
}

export default useFurniture