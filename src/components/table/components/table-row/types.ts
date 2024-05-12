import { MutableRefObject } from "react"

import { TableHeadersType } from "../../types";
import { ChangeEventFunc, MouseEventFunc } from "@/types/events";

export type PropsType = {
    id: string;
    headers: MutableRefObject<TableHeadersType[]>;
    onClick?: (row: Object) => MouseEventFunc;
    onChange?: (row: Object) => ChangeEventFunc;
    onRemove?: (row: Object) => MouseEventFunc;
    row: Object
}