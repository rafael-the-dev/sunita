import currency from "currency.js";
import moment from "moment";

import { ExpenseInfoType } from "@/types/expense";
import { ChartSerieType } from "@/types/chart";

import { daysOfWeek } from "@/config/chart";

const setValue = (map: Map<string, Map<string, number>>, mapKey: string, sale: ExpenseInfoType, saleKey: string, month: string) => {
    const newMonthMap =  new Map<string, number>();
    newMonthMap.set(mapKey, sale[saleKey]);
    map.set(month, newMonthMap);
};

const updateValue = (subMap: Map<string, number>, mapKey: string, expense: ExpenseInfoType, expenseKey: string) => {
    const dayValue = subMap.get(mapKey);
    const value = currency(expense[expenseKey]).add(dayValue).value;
    subMap.set(mapKey, value);
};

const defaultExpensesAnalyzer = (sales: ExpenseInfoType[], key: string) => {
    const expensesStatsMap = new Map<string, Map<string, number>>();

    sales.forEach(sale => {
        const date = moment(sale.createdAt);
        const month = date.format("MMM");
        const mapKey = date.format(key); 

        const monthMap = expensesStatsMap.get(month);

        if(!monthMap) {
            setValue(expensesStatsMap, mapKey, sale, "total", month);
        } else {
            updateValue(monthMap, mapKey, sale, "total")
        }
    });

    return {
        total: expensesStatsMap,
    };
};

const getWeeklySeries = (map: Map<string, Map<string, number>>, namePrefix: string) => {
    const series: ChartSerieType[] = [];

    map.forEach((dailyMonth, month) => {
        const serie: ChartSerieType = { data: [], name: `${namePrefix} ${month}` };
        
        daysOfWeek.forEach(dayOfWeek => {
            const value = dailyMonth.get(dayOfWeek);
            serie.data.push(value ?? 0);
        })

        series.push(serie);
    })

    return series;
};

export const getWeeklyExpensesStats = (expenses: ExpenseInfoType[]) => {
    const { total } = defaultExpensesAnalyzer(expenses, "ddd");

    const expensesSeries: ChartSerieType[] = getWeeklySeries(total, "Expenses");

    return expensesSeries
};

const getDailySeries = (map: Map<string, Map<string, number>>, namePrefix: string) => {
    const series: ChartSerieType[] = []

    map.forEach((dailyMonth, month) => {
        const serie: ChartSerieType = { data: [], name: `${namePrefix} ${month}` };
        
        for(let i = 0; i <= 31; i++) {
            const value = dailyMonth.get(`${i < 10 ? 0 : "" }${i}`);

            serie.data.push(value ?? 0);
        }

        series.push(serie);
    });

    return series;
};

export const getDailyExpensesStats = (expenses: ExpenseInfoType[]) => {
    const { total } = defaultExpensesAnalyzer(expenses, "DD");

    const expensesSeries: ChartSerieType[] = getDailySeries(total, "Expenses")

    return expensesSeries
};