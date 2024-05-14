import * as React from "react";
import dynamic from "next/dynamic";

import styles from "./styles.module.css"

import { ChartSerieType, ChartSeriesType, ChartXAxisType } from "@/types/chart";
import { ChangeEventFunc, MouseEventFunc } from "@/types/events";

import { AnalyticsContext  } from "@/context/AnalyticsContext";
import { daysOfWeek } from "@/config/chart";
import { getDayXAxis } from "./helper";

import Button from "./components/Button";
import Collapse from "@/components/collapse";
import RadioGroup from "./components/RadioGroup"
import { getId } from "@/helpers/id";

// const BarChart = dynamic(() => import( "./components/bar-chart"), { ssr: false });
const Chart = dynamic(() => import( "@/components/chart/line"), { ssr: false });

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
    const [ yAxis, setYAxis ] = React.useState<string[]>([ "SALES" ]);

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

    const yAxisChangeHandler: ChangeEventFunc<HTMLInputElement> = React.useCallback((e) => {
        const { value } = e.target;

        setYAxis(list => {
            const listClone = [ ...list ]
            if(list.includes(value)) return listClone.filter(item => item !== value);
            
            listClone.push(value);

            return listClone;
        });
    }, []);

    const isSelected = React.useCallback((currentValue: string | string[]) => (itemValue: string) => {
        if(Array.isArray(currentValue)) return currentValue.includes(itemValue);
        return currentValue === itemValue;
    }, []);

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
            onChange={yAxisChangeHandler}
            radio={false}
        />
    ), [ isSelected, yAxis, yAxisChangeHandler ]);

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

    const getSeries = React.useCallback((chartSeries: ChartSeriesType) => {
        const list: ChartSerieType[] = []

        const isIncluded = (id: string) => yAxis.includes(id);

        if(isIncluded("SALES")) list.push(...chartSeries.total);

        if(isIncluded("PROFIT")) list.push(...chartSeries.profit);

        if(isIncluded("EXPENSES")) list.push(...chartSeries.expenses);
       
        return list;
    }, [ yAxis ])

    const options = {
        series: {
            "DAY": getSeries(dailySalesStats),
            "WEEK": getSeries(weeklySalesStats)
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
                        "BAR": <Chart key={getId()} { ...options} />,
                        "LINE": <Chart key={getId()} { ...options } />
                    }[chart]
                }
            </div>
        </div>
    );
};

export default ChartContainer;