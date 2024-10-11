import * as React from "react";
import classNames from "classnames";

import { ExpenseInfoType } from "@/types/expense";
import { AnalyticsExpenseType } from "@/types/analytics";
import { LANGUAGE } from "@/types/language"
import { TableHeadersType } from "@/components/table/types";

import { AppContext } from "@/context/AppContext";
import { ExpensesContextProvider } from "@/context/ExpensesContext";
import { FiltersContext } from "@/context/FiltersContext"
import { LoginContext } from "@/context/LoginContext";

import useFetch from "@/hooks/useFetch";
import useLanguage from "@/hooks/useLanguage"
import useSearchParams from "@/hooks/useSearchParams";

import { formatDates } from "@/helpers/date";

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

const lang = {
    tableHeaders: {
        date: {
            [LANGUAGE.ENGLISH]: "Date",
            [LANGUAGE.PORTUGUESE]: "Data"
        },
        createdBy: {
            [LANGUAGE.ENGLISH]: "Created by",
            [LANGUAGE.PORTUGUESE]: "Criado por"
        },
        category: {
            [LANGUAGE.ENGLISH]: "Category",
            [LANGUAGE.PORTUGUESE]: "Categoria"
        },
    },
    formTitle: {
        category: {
            [LANGUAGE.ENGLISH]: "Categories",
            [LANGUAGE.PORTUGUESE]: "Categorias"
        },
        expenseDetails: {
            [LANGUAGE.ENGLISH]: "Expense Details",
            [LANGUAGE.PORTUGUESE]: "Detalhes da despesa"
        },
        registerExpenses: {
            [LANGUAGE.ENGLISH]: "Register Expenses",
            [LANGUAGE.PORTUGUESE]: "Registar despesas"
        },
    },
    buttons: {
        add: {
            [LANGUAGE.ENGLISH]: "Add",
            [LANGUAGE.PORTUGUESE]: "Adicionar"
        },
        categories: {
            [LANGUAGE.ENGLISH]: "Categories",
            [LANGUAGE.PORTUGUESE]: "Categorias"
        }
    },
}

const TabBody = () => {
    const { credentials } = React.useContext(LoginContext)
    const { setDialog } = React.useContext(AppContext);
    const { fetchData, ...rest } = React.useContext(FiltersContext);

    const { language } = useLanguage()

    const data = rest.data as AnalyticsExpenseType;

    const searchParams = useSearchParams();

    const reRenderCounter = React.useRef(0)

    const expensesRange = React.useMemo(() => data ? formatDates(data.list) : "", [ data ]);

    const headers = React.useMemo(
        () => (
            {
                current: [
                    {
                        label: lang.tableHeaders.date[language],
                        key: {
                            value: "createdAt"
                        }
                    },
                    {
                        label: lang.tableHeaders.createdBy[language],
                        key: {
                            value: "user",
                            subKey: {
                                value: "firstName"
                            }
                        }
                    },
                    {
                        label: lang.tableHeaders.category[language],
                        key: {
                            value: "category",
                            subKey: {
                                value: "name"
                            }
                        }
                    },
                    {
                        label: "Total",
                        key: {
                            value: "total"
                        }
                    }
                ]
            }
        ),
        [ language ]
    );

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
            body: <Categories url={`/api/stores/${credentials?.user?.stores[0]?.storeId}/expenses/categories`} />,
            header: {
                title: lang.formTitle.category[language]
            }
        })
    }, [ credentials, language, setDialog ]);

    const tableRowClickHandler = React.useCallback((expense: ExpenseInfoType) => () => {
        openRegisterExpenseDialog(lang.formTitle.expenseDetails[language], expense)
    }, [ language, openRegisterExpenseDialog ]);

    const openDialog = React.useCallback((id: DIALOG_TYPES) => () => {
        reRenderCounter.current = 0
        searchParams.setSearchParam("dialog", id.toString())
    }, [ searchParams ])

    const dialogQueryParam = searchParams.get("dialog", "");

    React.useEffect(
        () => {
            if(reRenderCounter.current === 2) return;

            if(dialogQueryParam === DIALOG_TYPES.CATEGORIES) {
                openCategoriesDialog();
                reRenderCounter.current += 1
            } 
            else if(dialogQueryParam === DIALOG_TYPES.REGISTER_CATEGORY) {
                openRegisterExpenseDialog(lang.formTitle.registerExpenses[language]);
                reRenderCounter.current += 1
            }
        }, 
        [ dialogQueryParam, language, openCategoriesDialog, openRegisterExpenseDialog ]
    );
    
    if(!data) return <></>;

    return (
        <div className="flex flex-col items-stretch justify-between overflow-y-auto py-4 scrollable">
            <div className="pb-20">
                <div className="items-stretch px-3 md:flex">
                    <Card>
                        <div>
                            <Card.Title>
                                <span className="text-base">
                                    { lang.tableHeaders.date[language] }
                                </span>
                                <br/>
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
                    { lang.buttons.categories[language] }
                </Button>
                <Button 
                    className="py-2 px-4"
                    onClick={openDialog(DIALOG_TYPES.REGISTER_CATEGORY)}>
                    { lang.buttons.add[language] }
                </Button>
            </div>
        </div>
    );
};

export default TabBody;