import { useCallback, useContext, useMemo, useRef } from "react";

import { AnalyticsContext } from "@/context/AnalyticsContext";
import { TableHeadersType } from "@/components/table/types";

import { AppContext } from "@/context/AppContext"

import { LANGUAGE } from "@/types/language"
import { SaleInfoType } from "@/types/sale";

import useLanguage from "@/hooks/useLanguage"

import SaleDetails from "./components/sale-details"
import Table from "@/components/shared/table";
import { SaleDetailsContextProvider } from "@/context/SaleDetailsContext";

const lang = {
    date: {
        [LANGUAGE.ENGLISH]: "Date",
        [LANGUAGE.PORTUGUESE]: "Data"
    },
    soldBy: {
        [LANGUAGE.ENGLISH]: "Sold by",
        [LANGUAGE.PORTUGUESE]: "Vendido por"
    },
    totalReceived: {
        [LANGUAGE.ENGLISH]: "Total received",
        [LANGUAGE.PORTUGUESE]: "Total recebido"
    },
    changes: {
        [LANGUAGE.ENGLISH]: "Change",
        [LANGUAGE.PORTUGUESE]: "Trocos"
    },
    profit: {
        [LANGUAGE.ENGLISH]: "Profit",
        [LANGUAGE.PORTUGUESE]: "Lucros"
    },
    formTitle: {
        [LANGUAGE.ENGLISH]: "Sale details",
        [LANGUAGE.PORTUGUESE]: "Detalhes da venda"
    },
}

const TableContainer = () => {
    const { fetchData, getAnalytics } = useContext(AnalyticsContext);
    const { setDialog } = useContext(AppContext)

    const { language } = useLanguage()

    const headers = useMemo(
        () => (
            {
                current: [
                    {
                        label: lang.date[language],
                        key: {
                            value: "createdAt"
                        }
                    },
                    {
                        label: lang.soldBy[language],
                        key: {
                            value: "user",
                            subKey: {
                                value: "firstName"
                            }
                        }
                    },
                    {
                        label: "Total",
                        key: {
                            value: "total"
                        }
                    },
                    {
                        label: lang.totalReceived[language],
                        key: {
                            value: "totalReceived"
                        }
                    },
                    {
                        label: lang.changes[language],
                        key: {
                            value: "changes"
                        }
                    },
                    {
                        label: lang.profit[language],
                        key: {
                            value: "profit"
                        }
                    }
                ]
            }
        ),
        [ language ]
    );

    const clickHandler = useCallback((row: SaleInfoType) => () => {
        setDialog({
            header: {
                title: lang.formTitle[language]
            },
            body: <SaleDetailsContextProvider initial={row} refreshData={fetchData}><SaleDetails /></SaleDetailsContextProvider>
        })
    }, [ fetchData, language, setDialog ])

    return (
        <Table 
            data={getAnalytics()?.sales?.list}
            headers={headers}
            onClickRow={clickHandler}
        />
    )
};

export default TableContainer;