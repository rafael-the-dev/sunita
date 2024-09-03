import classNames from "classnames";

import styles from "./styles.module.css";

import useSearchParams from "@/hooks/useSearchParams";
import { toISOString } from "@/helpers/date";

import DateTimeInput from "@/components/shared/date-filter";

const DateFilters = () => {
    const searchParams = useSearchParams()

    const startDate = searchParams.get("start-date", "");

    return (
        <div className="flex flex-wrap items-center justify-between">
            <DateTimeInput
                className={classNames(styles.datePicker, "input sm:mb-0")}
                id="start-date"
                label="Date"
            />
            { Boolean(startDate) && (
                <DateTimeInput
                    className={classNames(styles.datePicker, "input sm:mb-0")}
                    id="end-date"
                    label="End date"
                    minDate={toISOString(startDate)}
                /> 
            )}
        </div>
    );
};

export default DateFilters;