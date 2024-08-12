import { ChangeEvent, ReactNode } from "react"

import { PRODUCTS_CATEGORIES } from "@/types/product"

import { defaultInputField } from "@/config/input"

import { defaultFunicture } from "./hooks/useFurniture"
import { defaultProduct } from "./hooks/index"
import { defaultCarInput } from "./hooks/useCar"

type InputField = typeof defaultInputField

type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;

export type ContextType = {
    changeCategory: ChangeHandler,
    changeColor: ChangeHandler;
    input: typeof defaultProduct & {
        car: typeof defaultCarInput,
        furnicture: typeof defaultFunicture
    },
    changeName: ChangeHandler;
    changePrice: (prop: "purchase" | "sell") => ChangeHandler;

    // CAR
    changeEngineNumber: ChangeHandler;
    changeEngineType: ChangeHandler;
    changeMake: ChangeHandler;
    changeModel: ChangeHandler;
    changeTransmission: ChangeHandler;
    changeYear: ChangeHandler;

    //Furnicture
    changeDimensions: (prop: "height" | "length" | "width") => ChangeHandler;
    changeMaterial: ChangeHandler;
}

export type PropsType = {
    children: ReactNode
}