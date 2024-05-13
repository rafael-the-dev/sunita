import * as React from "react";

import { ChangeEventFunc, MouseEventFunc } from "@/types/events"

import Table from "@/components/table";
import TableRow from "@/components/table/components/table-row";
import { TableClassesType, TableHeadersType } from "@/components/table/types";

type TablePropsType = {
    classes?: TableClassesType;
    headers: React.MutableRefObject<TableHeadersType[]>
    data: Object & { id: string | number }[];
    onClickRow?: (row: Object) => MouseEventFunc<HTMLTableRowElement>;
    onChange?: (row: Object) => ChangeEventFunc<HTMLInputElement>;
    onRemoveRow?: (row: Object) => MouseEventFunc<HTMLButtonElement>;
}

const TableContainer = ({ classes, data, headers, onClickRow, onChange, onRemoveRow }: TablePropsType) => {
    
    const getBodyRows = ({ page, rowsPerPage }: { page: number, rowsPerPage: number }) => {
        const list = rowsPerPage > 0 ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : data;

        return list.map(row => (
            <TableRow 
                headers={headers}
                id={row.id}
                key={row.id}
                onClick={onClickRow}
                onChange={onChange}
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