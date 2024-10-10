import * as React from "react";
import { FormControl, FormControlLabel, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import classNames from "classnames";
import { v4 as uuidV4 } from "uuid";
import moment from "moment";

import classes from "./styles.module.css"

import { LANGUAGE } from "@/types/language"

import { AnalyticsContext } from "@/context/AnalyticsContext";

import useLanguage from "@/hooks/useLanguage"

import Chart from "./components/chart";
import Resizeable from "@/components/resizeable";
import Table from "./components/table"

import { formatDate, formatDates } from "@/helpers/date"

const lang = {
    chart: {
        [LANGUAGE.ENGLISH]: "Chart",
        [LANGUAGE.PORTUGUESE]: "Vendas"
    },
    list: {
        [LANGUAGE.ENGLISH]: "List",
        [LANGUAGE.PORTUGUESE]: "Lista"
    },
    sales: {
        [LANGUAGE.ENGLISH]: "Sales",
        [LANGUAGE.PORTUGUESE]: "Vendas"
    },
    table: {
        [LANGUAGE.ENGLISH]: "Table",
        [LANGUAGE.PORTUGUESE]: "Tabela"
    },
}

const Container = () => {
    const { getAnalytics } = React.useContext(AnalyticsContext);

    const [ value, setValue ] = React.useState("TABLE")

    const { language, translate } = useLanguage()

    const controls = React.useMemo(
        () => [
            { label: lang.table[language], value: "TABLE" },
            { label: lang.chart[language], value: "CHART" }
        ],
        [ language ]
    );



    const changeHandler = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value), []);

    const getSalesDate = React.useCallback(() => {
        const analytics = getAnalytics();

        if(!analytics) return [];

        return analytics.sales.list.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [ getAnalytics ]);

    const chartMemo = React.useMemo(() => <Chart />, [])
    const tableMemo = React.useMemo(() => <Table />, [])

    const titleMemo = React.useMemo(
        () => {
            const chartLabel = lang.chart[language]
            const listLabel = lang.list[language]
            const salesLabel = lang.sales[language]

            return (
                <Typography
                    component="h2"
                    className="font-bold text-xl">
                    { salesLabel } { value === "TABLE" ? listLabel : chartLabel } { formatDates(getSalesDate()) }
                </Typography>
            )
        }, 
        [ getSalesDate, language, value ]
    );
    
    const hasRange = React.useCallback(() => {
        const list = getSalesDate();

        if(list.length > 1) {
            return formatDate(list[0].createdAt) !== formatDate(list[list.length - 1].createdAt);
        }

        return false;
    }, [ getSalesDate ])

    const resizeHandler = React.useCallback((el: React.MutableRefObject<HTMLDivElement>) => {
        if(Boolean(el.current)) el.current.style.width = "100%";
    }, []);

    React.useEffect(() => {
        if(!hasRange()) {
            setValue("TABLE")
        }
    }, [ hasRange ])

    if(!getAnalytics()) return <></>

    return (
        <Resizeable classes={{ root: "bg-white rounded-md" }} onResize={resizeHandler} helper={resizeHandler}>
            <Paper 
                className="flex flex-col h-full mt-4 overflow-y-auto rounded-md w-full"
                elevation={0}>
                <div className="flex flex-col justify-between p-4 sm:flex-row sm:items-center">
                    { titleMemo }
                    <FormControl>
                        <RadioGroup
                            aria-labelledby="filters-title"
                            name="radio-buttons-group"
                            row
                        >
                            {
                                controls.map(item => (
                                    <FormControlLabel 
                                        { ...item }
                                        control={<Radio checked={value === item.value} onChange={changeHandler} />} 
                                        disabled={ item.value === "CHART" && !hasRange() }
                                        key={item.value}
                                    />
                                ))
                            }
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className={classNames(classes.tableContainer, "w-full")}>
                    { value === "TABLE" ? tableMemo : chartMemo }
                </div>
            </Paper>
        </Resizeable>
    );
};

export default Container;