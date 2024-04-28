import * as React from "react";
import classNames from "classnames";
import moment from "moment";
import { v4 as uuidV4 } from "uuid"
import { IconButton, TableCell, TableRow } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';

import { TableHeadersType, TableKeyType } from "../../types"

type TableRowPropsType = {
    headers: React.MutableRefObject<TableHeadersType[]>;
    onClick?: (row: Object) => (e: React.MouseEvent<HTMLTableRowElement>) => void;
    onRemove?: (row: Object) => (e: React.MouseEvent<HTMLButtonElement>) => void;
    row: Object
}

const concatValues = ({ obj, value }) => {
    if(Array.isArray(value)) {
        return value.map(field => obj[field]).join(" ")
    }

    return obj[value];
};

const TableRowContainer = ({ headers, onClick, row, onRemove }: TableRowPropsType) => {

    const getKey = ({ getComponent, key, value }: TableHeadersType) => {
        if(getComponent || Array.isArray(value)) {
            return uuidV4();
        }

        return uuidV4();
    };

    const getKeyValue = (key: TableKeyType, data: Object) => {
        const { subKey, value } = key;

        const result = data[value];
        
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
                        key={getKey(header)}>
                        { getLabel(header) }
                    </TableCell>
                ))
            }
        </TableRow>
    );
};

export default TableRowContainer;