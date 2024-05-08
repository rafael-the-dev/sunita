import * as React from "react";
import classNames from "classnames";
import Typography from "@mui/material/Typography";

import styles from "./styles.module.css"

import { TableHeadersType } from "@/components/table/types";
import { AppContext } from "@/context/AppContext";
import { AnalyticStockReportInfoType, StockReportInfoType } from "@/types/stock";

import useSearchParams from "@/hooks/useSearchParams";
import useFetch from "@/hooks/useFetch";

import Button from "@/components/shared/button"
import Collapse from "@/components/shared/collapse";
import DateTimeInput from "@/components/shared/date-filter";
import Table from "@/components/shared/table";
// import SubmitButton from "./components/submit-button";

const TabBody = () => {
    const { setDialog } = React.useContext(AppContext);

    const { data, fetchData, loading } = useFetch<AnalyticStockReportInfoType>({
        autoFetch: true,
        url: "http://localhost:3000/api/users/rafaeltivane/warehouses/12345/products/stock-reports"
    })

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
            label: "Reference",
            key: {
                value: "reference"
            }
        },
        {
            label: "Total",
            key: {
                value: "total"
            }
        }
    ])

    
    const tableRowClickHandler = React.useCallback((report: StockReportInfoType) => () => {
        // openDialog("Expense details", expense)
    }, [ ]);

    if(!data) return <h1>Loading</h1>;

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
                            { data.total } MT
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
                        {/*<SubmitButton 
                            fetchData={fetchData} 
                            loading={loading}
                        />*/}
                    </div>
                </Collapse>
            </div>
            <div className={classNames("mt-4 px-3 md:mt-8")}>
                <Table 
                    headers={headers}
                    data={data.list}
                    onClickRow={tableRowClickHandler}
                />
            </div>
            
        </div>
    );
};

export default TabBody;