import * as React from "react";
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import classNames from "classnames";
import moment from "moment"

import useSearchParams from "@/hooks/useSearchParams";
import { dateTimeFormat, toISOString } from "@/helpers/date";

import Input from "@/components/Textfield";

type ProspType = {
    className: string;
    label: string;
    minDate?: string;
    id: string;
};

const DateInputFilter = ({ className,id, label, minDate }: ProspType) => {
    const searchParams = useSearchParams()

    const date = searchParams.get(id, "");

    const changeHandler = React.useCallback((id: string) => (value: string) => {
        searchParams.setSearchParam(id, toISOString(value));
    }, [ searchParams ]);


    return (
        <DesktopDateTimePicker
            className={classNames(className)}
            inputFormat={dateTimeFormat}
            label={label}
            value={date ?? moment(Date.now())}
            minDate={minDate ?? toISOString('2024-01-01 00:00:00')}
            onChange={changeHandler(id)}
            renderInput={(params) => <Input {...params} />}
        />
    );
} ;

export default DateInputFilter;