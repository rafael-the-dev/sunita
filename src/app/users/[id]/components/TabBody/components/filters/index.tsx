import * as React from "react";
import { FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup } from "@mui/material";
import classNames from "classnames";

import styles from "./styles.module.css"

// import BarmanFilter from "./components/barman-filter";
import Collapse from "@/components/collapse"
import DateFilter from "./components/date";
import ProductFilter from "./components/products";
import { AnalyticsContext } from "@/context/AnalyticsContext";
import { AnalyticsFiltersContext } from "@/context/AnalyticsFilters";
// import SubmitButton from "./components/submit-button";
// import TableFilter from './components/table-filter';
import Users from './components/user';
import SubmitButon from "./components/submit-button";

const FiltersContainer = () => {
    const { onToggleCollapse } = React.useContext(AnalyticsFiltersContext)

    const [ value, setValue ] = React.useState("DATE");

    const controls = React.useRef([
        { label: 'Date', value: "DATE" },
        { label: 'Product', value: "PRODUCT" },
        // { label: 'Table', value: "TABLE" },
        { label: 'User', value: "USERS" },
        // { label: 'Barman', value: "BARMAN" }
    ]);

    const changeHandler = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), []);

    // const barmenFilterMemo = React.useMemo(() => <BarmanFilter />, []);
    const dateFilterMemo = React.useMemo(() => <DateFilter />, []);
    const productFilterMemo = React.useMemo(() => <ProductFilter />, []);
    // const submitButton = React.useMemo(() => <SubmitButton onClose={() => setOpen(false)} />, []);
    // const tableFilterMemo = React.useMemo(() => <TableFilter />, []);
    const usersFilterMemo = React.useMemo(() => <Users />, [])

    const childrenList = React.useRef({
        // "BARMAN": barmenFilterMemo,
        "DATE": dateFilterMemo,
        "PRODUCT": productFilterMemo,
        // 'TABLE': tableFilterMemo,
        'USERS': usersFilterMemo
    })

    const filtersMemo = React.useMemo(() => (
        <Paper 
            className="mb-6 p-4 pb-6"
            elevation={0}>
            <FormControl>
                <FormLabel id="filters-title">Filters</FormLabel>
                <RadioGroup
                    aria-labelledby="filters-title"
                    name="radio-buttons-group"
                    row
                >
                    {
                        controls.current.map(item => (
                            <FormControlLabel 
                                { ...item } 
                                control={<Radio checked={value === item.value} onChange={changeHandler} />} 
                                key={item.value}
                            />
                        ))
                    }
                </RadioGroup>
            </FormControl>
            <div className="pt-3">
                { childrenList.current[value] }
            </div>
        </Paper>
    ), [ changeHandler, value ])

    return (
        <Collapse 
            onToggle={onToggleCollapse}
            showSearchParam>
            <div className={classNames(styles.container, "rounded-md mt-24 mx-4 p-4 sm:px-4")}>
                { filtersMemo }
                <div className="">
                    <SubmitButon />
                </div>
            </div>
        </Collapse>
    );
};

export default FiltersContainer;