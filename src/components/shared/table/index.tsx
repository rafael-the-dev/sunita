import * as React from "react";
import { v4 as uuidV4 } from "uuid"

import Table from "@/components/table";
import TableRow from "@/components/table/components/table-row";
import { TableClassesType, TableHeadersType } from "@/components/table/types";

type TablePropsType<T> = {
    classes?: TableClassesType;
    headers: React.MutableRefObject<TableHeadersType[]>
    data: T[];
    onClickRow?: (row: T) => (e: React.MouseEvent<HTMLTableRowElement>) => void;
    onRemoveRow?: (row: T) => (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const TableContainer = <T extends Object>({ classes, data, headers, onClickRow, onRemoveRow }: TablePropsType<T>) => {
    
    const getBodyRows = ({ page, rowsPerPage }: { page: number, rowsPerPage: number }) => {
        const list = rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data;

        return list.map(row => (
            <TableRow 
                headers={headers}
                key={uuidV4()}
                onClick={onClickRow}
                onRemove={onRemoveRow}
                row={row}
            />
        ))
    };

    return (
        <Table 
            classes={classes}
            data={data}
            headers={headers}
            getBodyRows={getBodyRows}
        />
    );
};

export default TableContainer;