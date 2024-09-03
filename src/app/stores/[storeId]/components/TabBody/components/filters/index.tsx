import * as React from "react";
import { FormControl, FormLabel, Paper, RadioGroup } from "@mui/material";
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
import RadioButton from "@/components/radio-button";
import SubmitButton from "./components/submit-button";

enum FILTERS_TYPE {
    DATE = "date",
    PRODUCT = "product",
    USERS = "users"
}

const FiltersContainer = () => {
    const { onToggleCollapse } = React.useContext(AnalyticsFiltersContext)

    const [ value, setValue ] = React.useState(FILTERS_TYPE.DATE);

    const controls = React.useRef([
        { label: 'Date', value: FILTERS_TYPE.DATE },
        { label: 'Product', value: FILTERS_TYPE.PRODUCT },
        // { label: 'Table', value: "TABLE" },
        { label: 'User', value: FILTERS_TYPE.USERS },
        // { label: 'Barman', value: "BARMAN" }
    ]);

    const changeHandler = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value as FILTERS_TYPE), []);

    // const barmenFilterMemo = React.useMemo(() => <BarmanFilter />, []);
    const dateFilterMemo = React.useMemo(() => <DateFilter />, []);
    const productFilterMemo = React.useMemo(() => <ProductFilter />, []);
    // const submitButton = React.useMemo(() => <SubmitButton onClose={() => setOpen(false)} />, []);
    // const tableFilterMemo = React.useMemo(() => <TableFilter />, []);
    const usersFilterMemo = React.useMemo(() => <Users />, [])

    const childrenList = React.useRef({
        // "BARMAN": barmenFilterMemo,
        [FILTERS_TYPE.DATE]: dateFilterMemo,
        [FILTERS_TYPE.PRODUCT]: productFilterMemo,
        // 'TABLE': tableFilterMemo,
        [FILTERS_TYPE.USERS]: usersFilterMemo
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
                            <RadioButton 
                                { ...item } 
                                checked={value === item.value} 
                                onChange={changeHandler}
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
            <div className={classNames(styles.container, "rounded-md mt-3 xl:mt-10 mx-4 p-4 sm:px-4")}>
                { filtersMemo }
                <div className="">
                    <SubmitButton />
                </div>
            </div>
        </Collapse>
    );
};

export default FiltersContainer;