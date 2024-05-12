import { ChangeEvent, MouseEvent } from "react"


export type ChangeEventFunc = <T extends HTMLElement>(e: ChangeEvent<T>) => void;
export type MouseEventFunc = <T extends HTMLElement>(e: MouseEvent<T>) => void;