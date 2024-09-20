import { ChangeEvent } from "react"

import { initialAddress } from "./values"

export type AddressInputType = typeof initialAddress

type ChangeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => void

export type AddressEventHandlers = {
    countryChangeHandler: ChangeEventHandler;
    cityChangeHandler: ChangeEventHandler;
    numberChangeHandler: ChangeEventHandler;
    statetChangeHandler: ChangeEventHandler;
    streetChangeHandler: ChangeEventHandler;
}
