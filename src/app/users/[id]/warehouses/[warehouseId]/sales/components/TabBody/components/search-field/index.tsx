import * as React from "react";
import { ClickAwayListener, Paper } from "@mui/material";
import classNames from "classnames";

import classes from "./styles.module.css";

import { SaleContext } from "@/context/SalesContext/context/SaleContext";
import { SalesContext } from "@/context/SalesContext";

import { ProductInfoType } from "@/types/product";
import { TableHeadersType } from "@/components/table/types";

import Input from "@/components/Textfield";
import Table from "@/components/shared/table"

const Container = () => {
    const { addItem, isEmpty } = React.useContext(SaleContext);
    const { getProducts  } = React.useContext(SalesContext)

    const [ barCode, setBarCode ] = React.useState("");
    
    const headers = React.useRef<TableHeadersType[]>([
        { key: { value: "barcode" }, label: "Barcode" },
        { key: { value:  "name" }, label: "Name" },
    ]);

    const lastProductRef = React.useRef<ProductInfoType | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const filteredList = React.useMemo(() => {
        const list = getProducts();

        if(!list) return [];

        return list.filter(product => product.barcode?.toLowerCase()?.includes(barCode.toLowerCase()));
    }, [ barCode, getProducts ]);

    const barCodeChangeHandler = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => setBarCode(e.target.value), []);

    const handleClickAway = React.useCallback(() => setBarCode(""), []);

    const rowClickHandler = React.useCallback((product: ProductInfoType) => () => {
        lastProductRef.current = product;
        addItem(product, 1);
        setBarCode("");
    }, [ addItem ]);

    const inputMemo = React.useMemo(() => (
        <Input 
            className="w-full"
            id="bar-code-input"
            inputRef={inputRef}
            label="Insert bar code"
            onChange={barCodeChangeHandler}
            value={barCode}
        />
    ), [ barCode, barCodeChangeHandler ]);

    React.useEffect(() => {
        if(barCode.trim()) {
            if(lastProductRef.current && lastProductRef.current.barcode === barCode) {
                addItem(lastProductRef.current, 1)
                setBarCode("");
                return;
            }

            const product = getProducts().find(item => item.barcode === barCode);
            
            if(Boolean(product)) {
                lastProductRef.current = product;
                addItem(product, 1)
                setBarCode("");
            }
        }
    }, [ addItem, barCode, getProducts ]);

    React.useEffect(() => {
        if(isEmpty) {
            lastProductRef.current = null;
            inputRef.current.focus();
        }
    }, [ isEmpty ])

    React.useEffect(() => {
        inputRef.current.focus();
    }, [])

    return (
        <div className={classNames(classes.root, "input relative w12 xl:mb-0")}>
            { inputMemo }
            { Boolean(barCode) && (
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Paper 
                        className={classNames(classes.tableContainer, "absolute bottom-0 left-0 overflow-y-auto w-full z-10")}
                        elevation={4}>
                        <Table 
                            data={filteredList}
                            headers={headers}
                            onClickRow={rowClickHandler}
                            // onClose={handleClickAway}
                        />
                    </Paper>
                </ClickAwayListener>
            )}
        </div>
    );
};

export default Container;