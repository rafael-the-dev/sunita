import * as React from "react";
import classNames from "classnames";

import { TableHeadersType } from "@/components/table/types";
import { AppContext } from "@/context/AppContext";
import { FiltersContext } from "@/context/FiltersContext"
import { AnalyticStockReportInfoType, StockReportInfoType } from "@/types/stock";

import { StockContextProvider } from "@/context/StockContext";
import { formatDates } from "@/helpers/date";

import AddStock from "../../../components/add-stock";
import Card from "@/components/shared/report-card"
import Filters from "./components/Filters"
import Table from "@/components/shared/table";

const TabBody = () => {
    const { setDialog } = React.useContext(AppContext);
    const { fetchData, ...rest } = React.useContext(FiltersContext)
    const data = rest.data as AnalyticStockReportInfoType

    const expensesRange = React.useMemo(() => data ? formatDates(data.list) : "", [ data ])

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

    const rowClickHandler = React.useCallback((stockReport: StockReportInfoType) => () => {
        try {
            setDialog({
                header: {
                    title: "Stock Report"
                },
                body: (
                    <StockContextProvider 
                        productsList={[]}>
                        <AddStock refreshProducts={fetchData} />
                    </StockContextProvider>
                ),
                payload: stockReport
            });
        } catch(e) {
            console.error(e)
        }
    }, [ fetchData, setDialog ])

    if(!data) return <h1>Loading</h1>;

    return (
        <div className="overflow-y-auto py-4 scrollable">
            <div className="items-stretch px-3 md:flex">
                <Card>
                    <div>
                        <Card.Title>
                            <span className="text-base">Date</span><br/>
                            {expensesRange  }
                        </Card.Title>
                    </div>
                    <div>
                        <Card.Description>
                            { data.total } MT
                        </Card.Description>
                    </div>
                </Card>
                <Filters />
            </div>
            <div className={classNames("mt-4 px-3 md:mt-8")}>
                <Table 
                    headers={headers}
                    data={data.list}
                    onClickRow={rowClickHandler}
                />
            </div>
            
        </div>
    );
};

export default TabBody;