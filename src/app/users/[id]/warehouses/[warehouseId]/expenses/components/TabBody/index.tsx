import * as React from "react";
import classNames from "classnames";
import Typography from "@mui/material/Typography";

import styles from "./styles.module.css"
import useSearchParams from "@/hooks/useSearchParams";
import { TableHeadersType } from "@/components/table/types";


import Collapse from "@/components/shared/collapse";
import DateTimeInput from "@/components/shared/date-filter";
import Table from "@/components/shared/table";
const TabBody = () => {
    const searchParams = useSearchParams()
    const startDate = searchParams.get("start-date", "");

    const headers = React.useRef<TableHeadersType[]>([
        {
            label: "Date",
            key: {
                value: "createdAt"
            }
        },
        {
            label: "Created by",
            key: {
                value: "user",
                subKey: {
                    value: "firstName"
                }
            }
        },
        {
            label: "Caategory",
            key: {
                value: "category"
            }
        },
        {
            label: "Total",
            key: {
                value: "total"
            }
        }
    ])

    return (
        <div className="py-4">
            <div className="px-3 md:flex">
                <div className={classNames(styles.card, `bg-primary-700 mb-4 text-white px-3 py-4 md:flex flex-col
                    justify-around md:mb-0 md:pl-8`)}>
                    <div>
                        <Typography
                            component="h2"
                            className="text-lg">
                            Today
                        </Typography>
                    </div>
                    <div>
                        <Typography
                            component="h3"
                            className="font-semibold mt-3 text-2xl">
                            4352 MT
                        </Typography>
                    </div>
                </div>
                <Collapse 
                    classes={{ root: classNames(styles.filtersContainer, "border border-solid border-primary-200 grow md:ml-8")}} 
                    title="Filters">
                    <div>
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
                    </div>
                </Collapse>
            </div>
            <div className={classNames("mt-4 px-3 md:mt-8")}>
                <Table 
                    headers={headers}
                    data={[]}
                />
            </div>
        </div>
    );
};

export default TabBody;