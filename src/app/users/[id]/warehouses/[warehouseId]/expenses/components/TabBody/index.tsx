import * as React from "react";
import classNames from "classnames";

import { ExpenseInfoType } from "@/types/expense";
import { AnalyticsExpenseType } from "@/types/analytics";
import { TableHeadersType } from "@/components/table/types";

import { AppContext } from "@/context/AppContext";
import { ExpensesContextProvider } from "@/context/ExpensesContext";
import { FiltersContext } from "@/context/FiltersContext"

import useFetch from "@/hooks/useFetch";
import { formatDates } from "@/helpers/date";

import Button from "@/components/shared/button"
import Card from "@/components/shared/report-card"
import Filters from "./components/Filters"
import RegisterExpenses from "./components/add";
import Table from "@/components/shared/table";

const TabBody = () => {
    const { setDialog } = React.useContext(AppContext);
    const { fetchData, ...rest } = React.useContext(FiltersContext)
    const data = rest.data as AnalyticsExpenseType

    const expensesRange = React.useMemo(() => data ? formatDates(data.list) : "", [ data ])

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
            label: "Category",
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

    const openDialog = React.useCallback(<T extends Object>(title: string, payload?: T) => {
        setDialog({
            body: <ExpensesContextProvider><RegisterExpenses refreshData={fetchData} />,</ExpensesContextProvider>,
            header: {
                title
            },
            payload
        })
    }, [ fetchData, setDialog ]);

    const addExpenseEventHandler = React.useCallback(() => openDialog("Register expenses"), [ openDialog ])

    const tableRowClickHandler = React.useCallback((expense: ExpenseInfoType) => () => {
        openDialog("Expense details", expense)
    }, [ openDialog ]);
    
    if(!data) return <></>;

    return (
        <div className="flex flex-col items-stretch justify-between overflow-y-auto py-4 scrollable">
            <div className="pb-20">
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
                        onClickRow={tableRowClickHandler}
                    />
                </div>
            </div>
            <div className="bg-white box-border bottom-0 fixed flex justify-end mt-6 w-full sm:mt-0 px-3 py-4 right-0 sm:relative">
                <Button className="mr-3 py-2 px-4">Categories</Button>
                <Button 
                    className="py-2 px-4"
                    onClick={addExpenseEventHandler}>
                    Add
                </Button>
            </div>
        </div>
    );
};

export default TabBody;