import { ChangeEvent, MutableRefObject, useCallback, useRef, useState } from "react";
import classNames from "classnames";
import Paper from "@mui/material/Paper";

import styles from "./styles.module.css";

import { ChangeEventFunc } from "@/types/events";
import { TableHeadersType } from "@/components/table/types";
import useSearchParamsHook from "@/hooks/useSearchParams";

import Input from "@/components/Textfield";
import Table from "@/components/shared/table";

type PropsTypes<T> = {
    classes?: {
        table?: {
            container?: string
        }
    };
    data: T[];
    headers: MutableRefObject<TableHeadersType[]>;
    hasItems: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onRowChange?: (row: T) => (e: ChangeEvent<HTMLInputElement>) => void;
    value?: string;
}

const SearchField = <T extends { id: string }, >(props: PropsTypes<T>) => {
    const { classes, data, headers, hasItems, onChange, onRowChange, value } = props;

    return (
        <div className="relative">
            <Input 
                className={classNames("w-full")}
                label="Search"
                onChange={onChange}
                required
                value={value}
                variant="outlined"
            />
            {
                hasItems && (
                    <Paper 
                        className={classNames(styles.tableContainer, classes?.table?.container, "absolute left-0 overflow-y-auto w-full z-10")}>
                        <Table 
                            headers={headers}
                            data={data}
                            onChange={onRowChange}
                        />
                    </Paper>
                )
            }
        </div>
    );
};

export default SearchField;