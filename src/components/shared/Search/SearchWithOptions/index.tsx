import * as React from "react"
import classNames from "classnames"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import Paper from "@mui/material/Paper"

import styles from "./styles.module.css"

import useSearchParams from "@/hooks/useSearchParams"

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
    onClickRow?: (row: T) => void,
    searchParam?: boolean
}

const Container = React.forwardRef<HTMLInputElement, PropsType<ItemType>>(
    <T extends ItemType,>({ classes, headers, getList, input, onClickRow, searchParam }: PropsType<T>, ref: React.Ref<HTMLInputElement>) => {
        const [ value, setValue ] = React.useState("")

        const renderList = React.useRef(false)

        const searchParams = useSearchParams()
        const searchQueryString = (searchParams.get("search", "") as string).replaceAll("-", " ")
        const currentValue = searchParam ? searchQueryString : value

        const valueChangeHandler = React.useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;

                renderList.current = true

                if(searchParam) searchParams.setSearchParam("search", value);
                else setValue(value);
            }, 
            [ searchParam, searchParams ]
        );

        const closeHandler = React.useCallback(
            () => {
                if(!searchParam) setValue("");
            },
            [ searchParam ]
        )

        const handleClickAway = React.useCallback(() => closeHandler(), [ closeHandler ]);

        const list = getList(currentValue);

        const rowClickHandler = React.useCallback(
            (customer: T) => () => {
                onClickRow(customer);

                renderList.current = false

                closeHandler();
            },
            [ closeHandler, onClickRow ]
        )
        
        return (
            <div className={classNames(classes?.root, "input relative w12 xl:mb-0")}>
                <Input 
                    className="w-full"
                    inputRef={ref}
                    onChange={valueChangeHandler}
                    value={currentValue}
                    { ...(input ?? {}) }
                />
                { Boolean(currentValue.trim()) && (list.length > 0) && renderList.current && (
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