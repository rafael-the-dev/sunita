import * as React from "react";
import dynamic from "next/dynamic";

import styles from "./styles.module.css"

import { ChartSerieType, ChartSeriesType, ChartXAxisType } from "@/types/chart";
import { ChangeEventFunc, MouseEventFunc } from "@/types/events";
import { LANGUAGE } from "@/types/language"

import { AnalyticsContext  } from "@/context/AnalyticsContext";
import { daysOfWeek } from "@/config/chart";
import { getDayXAxis } from "./helper";

import useLanguage from "@/hooks/useLanguage"

import Button from "./components/Button";
import Collapse from "@/components/collapse";
import RadioGroup from "./components/RadioGroup"
import { getId } from "@/helpers/id";

// const BarChart = dynamic(() => import( "./components/bar-chart"), { ssr: false });
const Chart = dynamic(() => import( "@/components/chart/line"), { ssr: false });

enum CHART_TYPE {
    BAR = "bar",
    LINE = "line",
    PIE = "pie"
}

enum Y_AXIS {
    SALES = "sales",
    PROFIT = "profit",
    EXPENSES = "expenses"
}

const lang = {
    duration: {
        day: {
            [LANGUAGE.ENGLISH]: "Day",
            [LANGUAGE.PORTUGUESE]: "Dia"
        },
        week: {
            [LANGUAGE.ENGLISH]: "Week",
            [LANGUAGE.PORTUGUESE]: "Semana"
        },
        month: {
            [LANGUAGE.ENGLISH]: "Month",
            [LANGUAGE.PORTUGUESE]: "Mês"
        },
    },
    chartType: {
        bar: {
            [LANGUAGE.ENGLISH]: "Bar",
            [LANGUAGE.PORTUGUESE]: "Barra"
        },
        line: {
            [LANGUAGE.ENGLISH]: "Line",
            [LANGUAGE.PORTUGUESE]: "Linha"
        },
    },
    expenses: {
        [LANGUAGE.ENGLISH]: "Expenses",
        [LANGUAGE.PORTUGUESE]: "Despesas"
    },
    profit: {
        [LANGUAGE.ENGLISH]: "Profit",
        [LANGUAGE.PORTUGUESE]: "Lucros"
    },
    sales: {
        [LANGUAGE.ENGLISH]: "Sales",
        [LANGUAGE.PORTUGUESE]: "Vendas"
    },
}

const filtersList = [
    {
        id: "CHART_TYPE",
        label: {
            [LANGUAGE.ENGLISH]: "Chart type",
            [LANGUAGE.PORTUGUESE]: "Tipo de gráfico"
        }
    },
    {
        id: "X_AXE",
        label: {
            [LANGUAGE.ENGLISH]: "X axis",
            [LANGUAGE.PORTUGUESE]: "Eixo x"
        }
    },
    {
        id: "Y_AXE",
        label: {
            [LANGUAGE.ENGLISH]: "Y axis",
            [LANGUAGE.PORTUGUESE]: "Eixo y"
        }
    }
];

const ChartContainer = () => {
    const [ chart, setChart ] = React.useState(CHART_TYPE.LINE);
    const [ open, setOpen ] = React.useState("");
    const [ xAxis, setXAxis ] = React.useState("DAY");
    const [ yAxis, setYAxis ] = React.useState<Y_AXIS[]>([ Y_AXIS.SALES ]);

    const { dailySalesStats, weeklySalesStats } = React.useContext(AnalyticsContext);

    const { language } = useLanguage()

    const dayXAxis = React.useRef<ChartXAxisType>(getDayXAxis());
    const weekXAxis = React.useRef({ categories: daysOfWeek });

    const onCloseRef = React.useRef<() => void | null>(null);
    const onOpenRef = React.useRef<() => void | null>(null);

    const chartsType = React.useMemo(
        () => (
            {
                current: [
                    { label: lang.chartType.bar[language], value: CHART_TYPE.BAR },
                    { label: lang.chartType.line[language], value: CHART_TYPE.LINE },
                    { label: "Pie", value: CHART_TYPE.PIE }
                ]
            }
        ),
        [ language ]
    );

    const xAxeList = React.useMemo(
        () => (
            { 
                current: [
                    { label: lang.duration.day[language], value: "DAY" },
                    { label: lang.duration.week[language], value: "WEEK" },
                    { label: lang.duration.month[language], value: "MONTH" }
                ]
            }
        ),
        [ language ]
    );

    const yAxeList = React.useMemo(
        () => (
            {
                current: [
                    { label: lang["Sales"][language], value: Y_AXIS.SALES },
                    { label: lang["Profit"][language], value: Y_AXIS.PROFIT },
                    { label: lang["Expenses"][language], value: Y_AXIS.EXPENSES },
                ]
            }
        ),
        [ language ]
    );

    const clickHandler = React.useCallback(
        (newValue: string): MouseEventFunc<HTMLButtonElement> => () => {
            setOpen(currentValue => {
                if(currentValue === newValue) return "";

                return newValue;
            })
        }, 
        []
    );

    const changeHandler = React.useCallback((func: React.Dispatch<React.SetStateAction<string>>): ChangeEventFunc<HTMLInputElement> => (e) => {
        func(e.target.value);
    }, []);

    const yAxisChangeHandler: ChangeEventFunc<HTMLInputElement> = React.useCallback(
        (e) => {
            const value = e.target.value as Y_AXIS;

            setYAxis(list => {
                const listClone = [ ...list ]
                if(list.includes(value)) return listClone.filter(item => item !== value);
                
                listClone.push(value);

                return listClone;
            });
        }, 
        []
    );

    const isSelected = React.useCallback(
        (currentValue: string | string[]) => (itemValue: string) => {
            if(Array.isArray(currentValue)) return currentValue.includes(itemValue);

            return currentValue === itemValue;
        }, 
        []
    );

    const chartType = React.useMemo(
        () => (
            <RadioGroup 
                isSelected={isSelected(chart)}
                list={chartsType}
                onChange={changeHandler(setChart)}
            />
        ), 
        [ chart, chartsType, changeHandler, isSelected ]
    );

    const xAxisType = React.useMemo(
        () => (
            <RadioGroup 
                isSelected={isSelected(xAxis)}
                list={xAxeList}
                onChange={changeHandler(setXAxis)}
            />
        ), 
        [ changeHandler, isSelected, xAxis, xAxeList ]
    );

    const yAxisType = React.useMemo(
        () => (
            <RadioGroup 
                isSelected={isSelected(yAxis)}
                list={yAxeList}
                onChange={yAxisChangeHandler}
                radio={false}
            />
        ), 
        [ isSelected, yAxis, yAxeList, yAxisChangeHandler ]
    );

    const filters = React.useMemo(
        () => (
            filtersList.map(item => (
                <Button 
                    id={ item.id }
                    key={item.id}
                    onClick={clickHandler} 
                    selectedKey={open}>
                    { item.label[language] }
                </Button>
            ))
        ), 
        [ clickHandler, language, open ]
    )

    const getSeries = React.useCallback((chartSeries: ChartSeriesType) => {
        const list: ChartSerieType[] = []

        const isIncluded = (id: Y_AXIS) => yAxis.includes(id);

        if(isIncluded(Y_AXIS.SALES)) list.push(...chartSeries.total);

        if(isIncluded(Y_AXIS.PROFIT)) list.push(...chartSeries.profit);

        if(isIncluded(Y_AXIS.EXPENSES)) list.push(...chartSeries.expenses);
       
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
                        [CHART_TYPE.BAR]: <Chart key={getId()} { ...options} />,
                        [CHART_TYPE.LINE]: <Chart key={getId()} { ...options } />
                    }[chart]
                }
            </div>
        </div>
    );
};

export default ChartContainer;