import { ChangeEvent, useCallback, useContext, useState } from "react"
import currency from "currency.js"

import { ROOM_TYPE, RoomType } from "@/types/room"
import { PropertyType } from "@/types/property"

import { FixedTabsContext } from "@/context/FixedTabsContext"

import { isInvalidNumber } from "@/helpers/validation"
import { defaultInputField } from "@/config/input"
import { PROPERTY_TYPE } from "@/types/property"

const initialInput  = defaultInputField

const initial = {
    bedRoom: {
        quantity: structuredClone(initialInput),
        type: structuredClone({ ...initialInput, value: ROOM_TYPE.SINGLE })
    },
    images: [],
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
                    bedRoom: {
                        quantity: structuredClone({ ...initialInput, value: property.bedroom.quantity.toString() }),
                        type: structuredClone({ ...initialInput, value: property.bedroom.type })
                    },
                    images: property.images,
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

    const addImage = useCallback(
        (image: string) => {
            setInput(input => {
                if(image && image.trim()) {
                    const hasImage = Boolean(input.images.find(currentImage => currentImage === image));

                    if(hasImage) return input;

                    return {
                        ...input,
                        images: [ ...input.images, image ]
                    }
                }

                return input;
            })
        },
        []
    )

    const removeImage = useCallback(
        (id: string) => {
            setInput(input => {
                if(id && id.trim()) {
                    return {
                        ...input,
                        images: input.images.filter(image => image !== id)
                    }
                }

                return input
            })
        },
        []
    )

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

        addImage,
        changePrice,
        changePropertyType,
        changeQuantity,
        changeType,
        removeImage,
        resetForm
    }
}

export default useForm