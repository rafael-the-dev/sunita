import * as React from "react";
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';

import { dateTimeFormat } from "@/helpers/date";

import Input from "@/components/Textfield";

type ProspType = {
    className?: string;
    label?: string;
    minDateTime?: string;
    maxDateTime?: string;
    onChange: (value: string) => void;
    value: string;
};

const DateInputFilter = ({ ...rest }: ProspType) => {
    return (
        <DesktopDateTimePicker
            { ...rest }
            inputFormat={dateTimeFormat}
            renderInput={(params) => <Input {...params} />}
        />
    );
} ;

export default DateInputFilter;