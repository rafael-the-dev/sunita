import * as React from "react"
import classNames from "classnames"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import Paper from "@mui/material/Paper"

import styles from "./styles.module.css"

import Input from "@/components/Textfield"
import Table from "@/components/shared/table"
import { TableHeadersType } from "@/components/table/types"

type ItemType = {
    id: string | number
}

type PropsType<T extends ItemType> = {
    classes?: {
        root?: string
    }
    headers: React.MutableRefObject<TableHeadersType[]>,
    getList: (value: string) => T[],
    input?: {
        label?: string,
        placeholder?: string
    },
    onClickRow?: (row: T) => void 
}

const Container = React.forwardRef<HTMLInputElement, PropsType<ItemType>>(
    <T extends ItemType,>({ classes, headers, getList, input, onClickRow }: PropsType<T>, ref: React.Ref<HTMLInputElement>) => {
        const [ value, setValue ] = React.useState("")

        const barCodeChangeHandler = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), []);

        const handleClickAway = React.useCallback(() => setValue(""), []);

        const list = getList(value)

        const rowClickHandler = React.useCallback(
            (customer: T) => () => {
                onClickRow(customer)
                setValue("")
            },
            [ onClickRow ]
        )

        return (
            <div className={classNames(classes?.root, "input relative w12 xl:mb-0")}>
                <Input 
                    className="w-full"
                    inputRef={ref}
                    onChange={barCodeChangeHandler}
                    value={value}
                    { ...(input ?? {}) }
                />
                { Boolean(value.trim()) && (list.length > 0) && (
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <Paper 
                            className={classNames(styles.tableContainer, "absolute bottom-0 left-0 overflow-y-auto w-full z-10")}
                            elevation={4}>
                            <Table 
                                data={list}
                                headers={headers}
                                onClickRow={onClickRow ? rowClickHandler : null}
                                // onClose={handleClickAway}
                            />
                        </Paper>
                    </ClickAwayListener>
                )}
            </div>
        )
})

Container.displayName = "Searchfield"

export default Container