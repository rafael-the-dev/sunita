import { ChangeEvent, ReactNode } from "react"

import {
    defaultInput
} from "./values"

type ChangeHandler = (e: ChangeEvent<HTMLInputElement>) => void;

export type ProductInputsType = typeof defaultInput

export type ContextType = {
    changeCategory: ChangeHandler,
    changeColor: ChangeHandler;
    changeDescription: ChangeHandler;
    input: typeof defaultInput,
    changeName: ChangeHandler;
    changePrice: (prop: "purchase" | "sell") => ChangeHandler;
    hasErrors: () => boolean;
    reset: () => void;
    toString: () => string;

    // CAR
    changeEngineNumber: ChangeHandler;
    changeEngineType: ChangeHandler;
    changeMake: ChangeHandler;
    changeModel: ChangeHandler;
    changeTransmission: ChangeHandler;
    changeYear: ChangeHandler;

    // EXPIRABLE
    changeBarcode: ChangeHandler;
    changeExpirationDate: (value: string) => void;
    changeManufactureDate: (value: string) => void;

    //Furnicture
    changeDimensions: (prop: "height" | "length" | "width") => ChangeHandler;
    changeMaterial: ChangeHandler;
}

export type PropsType = {
    children: ReactNode
}