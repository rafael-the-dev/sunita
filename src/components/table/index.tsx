import * as React from "react"
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { v4 as uuidV4 } from "uuid";
import classNames from "classnames"

import { TableClassesType, TableHeadersType } from "./types"

import TablePaginationActions from "./components/TablePaginationActions"

type TablePropsType<T> = {
    classes?: TableClassesType;
    isDefault?: boolean;
    data: T[];
    getBodyRows: ({ page, rowsPerPage }: { page: number, rowsPerPage: number }) => React.ReactNode;
    headers: React.MutableRefObject<TableHeadersType[]>
}

const Container = <T extends Object>({ classes, data, isDefault = true, getBodyRows, headers }: TablePropsType<T>) => {
    const [ page, setPage ] = React.useState(0);
    const [ rowsPerPage, setRowsPerPage ] = React.useState(3);

    const handleChangePage = React.useCallback((event: React.MouseEvent<HTMLButtonElement>, newPage: number) => {
        setPage(newPage);
    }, []);
    
    const handleChangeRowsPerPage = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const tableHeader = React.useMemo(() => (
        <TableHead>
            <TableRow 
                className={classNames(classes?.tableHeaderRow, { "bg-primary-800 text-white opacity-70": isDefault })}>
                {
                    headers.current.map(header => (
                        <TableCell 
                            align="center"
                            className={classNames(classes?.tableHeadCell, `text-current`)}
                            key={uuidV4()}>
                            { header.label }
                        </TableCell>
                    ))
                }
            </TableRow>
        </TableHead>
    ), [ classes, headers, isDefault ]);

    return (
        <TableContainer className={classNames(classes?.root)}>
            <Table className={classNames(classes?.table, "border border-solid border-stone-300")} sx={{ minWidth: 500 }} aria-label="custom pagination table">
                { tableHeader }
                <TableBody>
                    { getBodyRows({ page, rowsPerPage }) }
                </TableBody>
                <TableFooter className={classNames(classes?.tableFooter)}>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[2, 3, 5, 7, 10, 15, 25, { label: 'All', value: -1 }]}
                            colSpan={headers.current.length}
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                'aria-label': 'rows per page',
                                },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
};

export default Container;