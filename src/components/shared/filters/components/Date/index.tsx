
import classNames from "classnames";

import styles from "./styles.module.css";

import useSearchParams from "@/hooks/useSearchParams";

import DateTimeInput from "@/components/shared/date-filter";

const DateFilter = () => {

    const searchParams = useSearchParams();
    const startDate = searchParams.get("start-date", "");

    return (
        <div className="md:flex justify-between">
            <DateTimeInput 
                className={classNames(styles.dateInput, "mb-3 w-full")}
                id="start-date"
                label="Date"
            />
            { startDate && (
                <DateTimeInput 
                    className={classNames(styles.dateInput, "w-full")}
                    id="end-date"
                    label="Date"
                />
            )}
        </div>
    )
};

export default DateFilter;