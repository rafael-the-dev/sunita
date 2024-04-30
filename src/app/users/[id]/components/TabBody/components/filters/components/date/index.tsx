import * as React from "react";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import classNames from "classnames";
import moment from "moment"

import classes from "./styles.module.css";
import useSearchParams from "@/hooks/useSearchParams";
import { dateTimeFormat, toISOString } from "@/helpers/date";

import Input from "@/components/Textfield";

const DateFilters = () => {
    const searchParams = useSearchParams()

    const startDate = searchParams.get("start-date", "");
    const endDate = searchParams.get("end-date", "")

    const changeHandler = React.useCallback((key: string) => (value: string) => {
        searchParams.setSearchParam(key, toISOString(value));
    }, [ searchParams ]);

    return (
        <div className="flex flex-wrap items-center">
            <DesktopDateTimePicker
                className={classNames(classes.datePicker, "input sm:mr-4 sm:mb-0")}
                inputFormat={dateTimeFormat}
                label="Date"
                value={startDate ?? moment(Date.now())}
                minDate={toISOString('2024-01-01 00:00:00')}
                onChange={changeHandler("start-date")}
                renderInput={(params) => <Input {...params} />}
            />
            { Boolean(startDate) && <DesktopDateTimePicker
                className={classNames(classes.datePicker, "input sm:mr-4 sm:mb-0")}
                inputFormat={dateTimeFormat}
                label="End date"
                value={endDate}
                minDate={toISOString(startDate)}
                onChange={changeHandler("end-date")}
                renderInput={(params) => <Input {...params} />}
            /> }
        </div>
    );
};

export default DateFilters;