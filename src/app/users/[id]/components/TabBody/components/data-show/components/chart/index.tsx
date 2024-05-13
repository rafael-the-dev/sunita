import * as React from "react";
import dynamic from "next/dynamic";

import styles from "./styles.module.css"

import { AnalyticsContext  } from "@/context/AnalyticsContext";
import { ChartXAxisType } from "@/types/chart";

import { getDayXAxis } from "./helper";

import Button from "./components/Button";
import Collapse from "@/components/collapse";
import RadioGroup from "./components/RadioGroup"
import { ChangeEventFunc, MouseEventFunc } from "@/types/events";
import { daysOfWeek } from "@/config/chart";

// const BarChart = dynamic(() => import( "./components/bar-chart"), { ssr: false });
const LineChart = dynamic(() => import( "@/components/chart/line"), { ssr: false });

const filtersList = [
    {
        id: "CHART_TYPE",
        label: "Chart type"
    },
    {
        id: "X_AXE",
        label: "X axis"
    },
    {
        id: "Y_AXE",
        label: "Y axis"
    }
];

const ChartContainer = () => {
    const [ chart, setChart ] = React.useState("LINE");
    const [ open, setOpen ] = React.useState("");
    const [ xAxis, setXAxis ] = React.useState("DAY");
    const [ yAxis, setYAxis ] = React.useState("total");

    const { dailySalesStats, weeklySalesStats } = React.useContext(AnalyticsContext);

    const dayXAxis = React.useRef<ChartXAxisType>(getDayXAxis());
    const weekXAxis = React.useRef({ categories: daysOfWeek });

    const onCloseRef = React.useRef<() => void | null>(null);
    const onOpenRef = React.useRef<() => void | null>(null);

    const chartsType = React.useRef([
        { label: "Bar", value: "BAR" },
        { label: "Line", value: "LINE" },
        { label: "Pie", value: "PIE" }
    ]);

    const xAxeList = React.useRef([
        { label: "Day", value: "DAY" },
        { label: "Week", value: "WEEK" },
        { label: "Month", value: "MONTH" }
    ]);

    const yAxeList = React.useRef([
        { label: "Sales", value: "SALES" },
        { label: "Profit", value: "PROFIT" },
        { label: "Expenses", value: "EXPENSES" },
    ]);

    const clickHandler = React.useCallback((newValue: string): MouseEventFunc<HTMLButtonElement> => () => {
        setOpen(currentValue => {
            if(currentValue === newValue) return "";

            return newValue;
        })
    }, []);

    const changeHandler = React.useCallback((func: React.Dispatch<React.SetStateAction<string>>): ChangeEventFunc<HTMLInputElement> => (e) => {
        func(e.target.value);
    }, []);

    const isSelected = React.useCallback((currentValue: string) => (itemValue: string) => currentValue === itemValue, []);

    const chartType = React.useMemo(() => (
        <RadioGroup 
            isSelected={isSelected(chart)}
            list={chartsType}
            onChange={changeHandler(setChart)}
        />
    ), [ chart, changeHandler, isSelected ]);

    const xAxisType = React.useMemo(() => (
        <RadioGroup 
            isSelected={isSelected(xAxis)}
            list={xAxeList}
            onChange={changeHandler(setXAxis)}
        />
    ), [ changeHandler, isSelected, xAxis ]);

    const yAxisType = React.useMemo(() => (
        <RadioGroup 
            isSelected={isSelected(yAxis)}
            list={yAxeList}
            onChange={changeHandler(setYAxis)}
        />
    ), [ changeHandler, isSelected, yAxis ]);

    const filters = React.useMemo(() => (
        filtersList.map(item => (
            <Button 
                id={ item.id }
                key={item.id}
                onClick={clickHandler} 
                selectedKey={open}>
                { item.label }
            </Button>
        ))
    ), [ clickHandler, open ])

    /*const optionsByDay = React.useMemo(() => {:;
        const salesList = getSales().list;
        const params = { data: salesList, isBarChart: chart === "BAR", yAxis: yAxe };

        if([ "DAY", "WEEK" ].includes(xAxe)) {
            return getChartOptionsGroupedByDay({ 
                ...params,
                isWeekly: xAxe !== "DAY", 
            })
        }
        else if(xAxe === "MONTH") {
            return groupByMonth(params);
        }
    }, [ chart, getSales, xAxe,  yAxe ]);*/

    const options = {
        series: {
            "DAY": dailySalesStats,
            "WEEK": weeklySalesStats
        }[xAxis],
        type: {
            "BAR": "bar",
            "LINE": "line"
        }[chart],
        xAxis: {
            "DAY": dayXAxis,
            "WEEK": weekXAxis
        }[xAxis]
    }
    console.log(xAxis, options)


    React.useEffect(() => {
        if(open) onOpenRef.current?.();
        else onCloseRef.current?.();
    }, [ open ])
    
    return (
        <div className="h-full w-full">
            <div className="px-4">
                <div className="flex flex-col items-start sm:flex-row">
                    { filters }
                </div>
                <div className="pl-2">
                    <Collapse onClose={onCloseRef} onOpen={onOpenRef}>
                        {
                            {   
                                "CHART_TYPE": chartType,
                                "X_AXE": xAxisType,
                                "Y_AXE": yAxisType
                            }[open]
                        }
                    </Collapse>
                </div>
            </div>
            <div className={Boolean(open) ? styles.chartContainerOpen : styles.chartContainer}>
                {
                    {
                        // "BAR": <BarChart { ...optionsByDay } />,:;
                        "LINE": <LineChart { ...options } />
                    }[chart]
                }
            </div>
        </div>
    );
};

export default ChartContainer;