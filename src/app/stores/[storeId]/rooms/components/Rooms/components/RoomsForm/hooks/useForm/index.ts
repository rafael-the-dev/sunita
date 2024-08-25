import { ChangeEvent, useCallback, useContext, useState } from "react"
import currency from "currency.js"

import { ROOM_TYPE, RoomType } from "@/types/room"
import { PropertyType } from "@/types/property"

import { FixedTabsContext } from "@/context/FixedTabsContext"

import { isInvalidNumber } from "@/helpers/validation"
import { defaultInputField } from "@/config/input"
import { PROPERTY_TYPE } from "@/types/property"
import { isValidName } from "@/validation/product"

const initialInput  = defaultInputField

const initial = {
    amenities: [],
    bedRoom: {
        quantity: structuredClone(initialInput),
        type: structuredClone({ ...initialInput, value: ROOM_TYPE.SINGLE })
    },
    images: [],
    name: structuredClone(initialInput),
    price: {
        hour: structuredClone(initialInput),
        day: structuredClone(initialInput),
        night: structuredClone(initialInput)
    },
    propertyType: structuredClone({ ...initialInput, value: PROPERTY_TYPE.BED_ROOM })
}

const useForm = () => {
    const { getDialog } = useContext(FixedTabsContext)

    const property = getDialog().current.payload as PropertyType

    const [ input, setInput ] = useState(
        () => {
            if(property) {
                return {
                    amenities: structuredClone(property.amenities),
                    bedRoom: {
                        quantity: structuredClone({ ...initialInput, value: property.bedroom.quantity.toString() }),
                        type: structuredClone({ ...initialInput, value: property.bedroom.type })
                    },
                    images: structuredClone(property.images),
                    name: structuredClone({ ...initialInput, value: property.name }), 
                    price: {
                        day: structuredClone({ ...initialInput, value: property.price.daily.toString() }), 
                        hour: structuredClone({ ...initialInput, value: property.price.hourly.toString() }),
                        night: structuredClone({ ...initialInput, value: property.price.night.toString() }),
                    },
                    propertyType: structuredClone({ ...initialInput, value: property.type }),
                }
            }

            return initial
        }
    );

    const push = useCallback(
        (key: "amenities" | "images", value: string) => {
            setInput(input => {
                if(value && value.trim()) {
                    const hasImage = Boolean(input[key].find(currentValue => currentValue === value));

                    if(hasImage) return input;

                    return {
                        ...input,
                        [key]: [ ...input[key], value ]
                    }
                }

                return input;
            })
        },
        []
    )

    const addImage = useCallback(
        (image: string) => push("images", image),
        [ push ]
    )

    const addAmenity = useCallback(
        (image: string) => push("amenities", image),
        [ push ]
    )

    const pull = useCallback(
        (key: "amenities" | "images", id: string) => {
            setInput(input => {
                if(id && id.trim()) {
                    return {
                        ...input,
                        [key]: input[key].filter(value => value !== id)
                    }
                }

                return input
            })
        },
        []
    )

    const removeImage = useCallback(
        (id: string) => pull("images", id),
        [ pull ]
    )

    const removeAmenity = useCallback(
        (id: string) => pull("amenities", id),
        [ pull ]
    )

    const changeName = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const value  = e.target.value;

            const hasError = !isValidName(value)

            setInput(
                input => ({
                    ...input,
                    name: {
                        error: hasError,
                        helperText: hasError ? "Invalid name" : "",
                        value
                    }
                })
            );
        },
        []
    );

    const changeQuantity = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;

            const quantity = parseInt(value);

            const isInvalid = isInvalidNumber(quantity, 1);

            const helperText = isInvalid ? "Invalid number" : "";

            setInput(
                input => ({
                    ...input,
                    bedRoom: {
                        ...input.bedRoom,
                        quantity: {
                            error: isInvalid,
                            helperText,
                            value
                        }
                    }
                })
            );
        },
        []
    );

    const changePrice = useCallback(
        (key: "day" | "hour" | "night") => (e: ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;

            const price = currency(value).value;

            const isInvalid = isInvalidNumber(price, 1);
            
            const helperText = isInvalid ? "Invalid price" : "";

            setInput(
                input => ({
                    ...input,
                    price: {
                        ...input.price,
                        [key]: {
                            error: isInvalid,
                            helperText,
                            value
                        }
                    }
                })
            );
        },
        []
    );

    const changeType = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const value  = e.target.value as ROOM_TYPE;

            setInput(
                input => ({
                    ...input,
                    bedRoom: {
                        ...input.bedRoom,
                        type: {
                            error: false,
                            helperText: "",
                            value
                        }
                    }
                })
            );
        },
        []
    );

    const changePropertyType = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const value  = e.target.value as PROPERTY_TYPE;

            setInput(
                input => ({
                    ...input,
                    propertyType: {
                        error: false,
                        helperText: "",
                        value
                    }
                })
            );
        },
        []
    );

    const resetForm = useCallback(
        () => setInput(initial),
        []
    )

    return {
        input,

        addAmenity,
        addImage,
        changeName,
        changePrice,
        changePropertyType,
        changeQuantity,
        changeType,
        removeAmenity,
        removeImage,
        resetForm
    }
}

export default useForm