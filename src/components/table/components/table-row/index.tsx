import * as React from "react";
import classNames from "classnames";
import moment from "moment";
import { v4 as uuidV4 } from "uuid"
import { IconButton, TableCell, TableRow } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';

import { TableHeadersType, TableKeyType } from "../../types"

import Checkbox from "@/components/checkbox";
import useSearchParams from "@/hooks/useSearchParams";

type TableRowPropsType = {
    id: string;
    headers: React.MutableRefObject<TableHeadersType[]>;
    onClick?: (row: Object) => (e: React.MouseEvent<HTMLTableRowElement>) => void;
    onChange?: (row: Object) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove?: (row: Object) => (e: React.MouseEvent<HTMLButtonElement>) => void;
    row: Object
}

const concatValues = ({ obj, value }) => {
    if(Array.isArray(value)) {
        return value.map(field => obj[field]).join(" ")
    }

    return obj[value];
};

const TableRowContainer = ({ headers, id, onClick, onChange, row, onRemove }: TableRowPropsType) => {
    const searchParams = useSearchParams();

    const getKey = (key: TableKeyType) => {
        const { subKey, value } = key;

        if(subKey) {
            return `${value}-${getKey(key.subKey)}`;
        }

        return value
    };

    const getKeyValue = (key: TableKeyType, data: Object) => {
        const { subKey, value } = key;

        const result = data[value];
        if(value.startsWith("select_")) {
            const searchKey = value.split("_")[1];
            const searchedValues = searchParams.getAll(searchKey);

            return (
                <Checkbox 
                    checked={searchParams.isChecked(searchedValues, id)}
                    onChange={onChange && onChange(row)}
                />
            );
        }
        if(value === "date" || value === "createdAt") {
            return moment(result).format("DD/MM/YYYY HH:mm:ss");
        } else if(value === "delete") {
            return <div><IconButton className="hover:text-red-600" onClick={onRemove && onRemove(row)}><DeleteIcon /></IconButton></div>;
        } else if(subKey) {
            return getKeyValue(key.subKey, result);
        } else {
            return result;
        }
    };
    
    const getLabel = ({ getComponent, key }: TableHeadersType) => {
        if(getComponent) {
            return getComponent({ item: row, key });
        }

        return getKeyValue(key, row);
    };

    return (
        <TableRow 
            className={classNames({ "cursor-pointer hover:bg-stone-100": Boolean(onClick) })}
            onClick={onClick && onClick(row)}>
            {
                headers.current.map(header => (
                    <TableCell
                        align="center"
                        key={getKey(header.key)}>
                        { getLabel(header) }
                    </TableCell>
                ))
            }
        </TableRow>
    );
};

export default TableRowContainer;