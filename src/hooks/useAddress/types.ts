import { ChangeEvent } from "react"

import { initialAddress } from "./values"

export type AddressInputType = typeof initialAddress

type ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => void

export type AddressEventHandlers = {
    countryChangeHandler: ChangeEventHandler;
    cityChangeHandler: ChangeEventHandler;
    hasErrors: () => boolean;
    numberChangeHandler: ChangeEventHandler;
    statetChangeHandler: ChangeEventHandler;
    streetChangeHandler: ChangeEventHandler;
    setCords: (lat: number, long: number) => void
}

export type PropsType = {
    hasCords: boolean
}
