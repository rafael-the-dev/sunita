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
import useSearchParams from "@/hooks/useSearchParams";

import Button from "@/components/shared/button"
import Card from "@/components/shared/report-card"
import Categories from "./components/categories";
import Filters from "./components/Filters"
import RegisterExpenses from "./components/add";
import Table from "@/components/shared/table";

enum DIALOG_TYPES {
    CATEGORIES = "categories",
    EDIT_CATEGORY = "edit-category",
    REGISTER_CATEGORY = "register-category"
}

const TabBody = () => {
    const { setDialog } = React.useContext(AppContext);
    const { fetchData, ...rest } = React.useContext(FiltersContext);
    const data = rest.data as AnalyticsExpenseType;

    const searchParams = useSearchParams();

    const reRenderCounter = React.useRef(0)

    const expensesRange = React.useMemo(() => data ? formatDates(data.list) : "", [ data ]);

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
    ]);

    const openRegisterExpenseDialog = React.useCallback(<T extends Object>(title: string, payload?: T) => {
        setDialog({
            body: <ExpensesContextProvider><RegisterExpenses refreshData={fetchData} />,</ExpensesContextProvider>,
            header: {
                title
            },
            payload
        })
    }, [ fetchData, setDialog ]);

    const openCategoriesDialog = React.useCallback(() => {
        setDialog({
            body: <Categories url="/api/users/rafaeltivane/warehouses/12345/expenses/categories" />,
            header: {
                title: "Categories"
            }
        })
    }, [ setDialog ]);

    const tableRowClickHandler = React.useCallback((expense: ExpenseInfoType) => () => {
        openRegisterExpenseDialog("Expense details", expense)
    }, [ openRegisterExpenseDialog ]);

    const openDialog = React.useCallback((id: DIALOG_TYPES) => () => {
        reRenderCounter.current = 0
        searchParams.setSearchParam("dialog", id.toString())
    }, [ searchParams ])

    React.useEffect(() => {
        const dialog = searchParams.get("dialog", "");

        if(reRenderCounter.current === 2) return;

        if(dialog === DIALOG_TYPES.CATEGORIES) {
            openCategoriesDialog();
            reRenderCounter.current += 1
        } 
        else if(dialog === DIALOG_TYPES.REGISTER_CATEGORY) {
            openRegisterExpenseDialog("Register expenses");
            reRenderCounter.current += 1
        }

    }, [ openCategoriesDialog,openRegisterExpenseDialog , searchParams ])
    
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
                <Button 
                    className="mr-3 py-2 px-4"
                    onClick={openDialog(DIALOG_TYPES.CATEGORIES)}>
                    Categories
                </Button>
                <Button 
                    className="py-2 px-4"
                    onClick={openDialog(DIALOG_TYPES.REGISTER_CATEGORY)}>
                    Add
                </Button>
            </div>
        </div>
    );
};

export default TabBody;