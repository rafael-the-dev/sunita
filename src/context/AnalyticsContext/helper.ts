import currency from "currency.js";
import moment from "moment";

import { SaleInfoType } from "@/types/sale";
import { ChartSerieType } from "@/types/chart";

import { daysOfWeek } from "@/config/chart";

export const monthlySalesStats = (sales: SaleInfoType[]) => {
    const statsMap = new Map<string, number>();

    sales.forEach(sale => {
        const date = moment(sale.createdAt);
        const month = date.format("MMM");

        const monthValue = statsMap.get(month);
        const value = currency(sale.total).add(monthValue ?? 0).value;
        statsMap.set(month, value);
    });

    return statsMap;
};

const setValue = (map: Map<string, Map<string, number>>, mapKey: string, sale: SaleInfoType, saleKey: string, month: string) => {
    const newMonthMap =  new Map<string, number>();
    newMonthMap.set(mapKey, sale[saleKey]);
    map.set(month, newMonthMap);
};

const updateValue = (subMap: Map<string, number>, mapKey: string, sale: SaleInfoType, saleKey: string) => {
    const dayValue = subMap.get(mapKey);
    const value = currency(sale[saleKey]).add(dayValue).value;
    subMap.set(mapKey, value);
};

const defaultSalesAnalyzer = (sales: SaleInfoType[], key: string) => {
    const statsMap = new Map<string, Map<string, number>>();
    const profitStatsMap = new Map<string, Map<string, number>>();

    sales.forEach(sale => {
        const date = moment(sale.createdAt);
        const month = date.format("MMM");
        const mapKey = date.format(key); 

        const monthMap = statsMap.get(month);
        const profitMonthMap = profitStatsMap.get(month);

        if(!monthMap) {
            setValue(statsMap, mapKey, sale, "total", month);
            setValue(profitStatsMap, mapKey, sale, "profit", month);
        } else {
            updateValue(monthMap, mapKey, sale, "total")
            updateValue(profitMonthMap, mapKey, sale, "profit")
        }
    });

    return {
        profit: profitStatsMap,
        total: statsMap,
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

export const getWeeklySaleStats = (sales: SaleInfoType[]) => {
    const { profit, total } = defaultSalesAnalyzer(sales, "ddd");

    const salesSeries: ChartSerieType[] = getWeeklySeries(total, "Sales");
    const profitSeries: ChartSerieType[] = getWeeklySeries(profit, "Profit");

    return {
        profit: profitSeries,
        total: salesSeries
    }
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

export const getDailySaleStats = (sales: SaleInfoType[]) => {
    const { profit, total } = defaultSalesAnalyzer(sales, "DD");

    const salesSeries: ChartSerieType[] = getDailySeries(total, "Sales")
    const profitSeries: ChartSerieType[] = getDailySeries(profit, "Profit")

    return {
        profit: profitSeries,
        total: salesSeries
    }
};