import * as React from "react";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';

import { dateFormat, dateTimeFormat } from "@/helpers/date";

import Input from "@/components/Textfield";

type ProspType = {
    className?: string;
    date?: boolean,
    error?: boolean,
    helperText?: string,
    label?: string;
    minDate?: string;
    maxDate?: string;
    minDateTime?: string;
    maxDateTime?: string;
    onChange: (value: string) => void;
    value: string;
};

const DateInputFilter = ({ date, error, helperText, ...rest }: ProspType) => {
    if(date) {
        return (
            <DesktopDatePicker 
                { ...rest }
                inputFormat={dateFormat}
                renderInput={ (params) => <Input { ...params } error={error} helperText={helperText} /> }
            />
        )
    }

    return (
        <DesktopDateTimePicker
            { ...rest }
            inputFormat={dateTimeFormat}
            renderInput={(params) => <Input {...params} error={error} helperText={helperText} />}
        />
    );
} ;

export default DateInputFilter;