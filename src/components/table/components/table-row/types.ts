import { MutableRefObject } from "react"

import { TableHeadersType } from "../../types";
import { ChangeEventFunc, MouseEventFunc } from "@/types/events";

export type PropsType = {
    id: string | number;
    headers: MutableRefObject<TableHeadersType[]>;
    onClick?: (row: Object) => MouseEventFunc<HTMLTableRowElement>;
    onChange?: (row: Object) => ChangeEventFunc<HTMLInputElement>;
    onRemove?: (row: Object) => MouseEventFunc<HTMLButtonElement>;
    row: Object
}