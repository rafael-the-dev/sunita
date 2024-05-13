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
}

const defaultAnalyzer = (sales: SaleInfoType[], key: string) => {
    const statsMap = new Map<string, Map<string, number>>();

    sales.forEach(sale => {
        const date = moment(sale.createdAt);
        const month = date.format("MMM");
        const keyValue = date.format(key); 

        const monthMap = statsMap.get(month);

        if(!monthMap) {
            const newMonthMap =  new Map<string, number>();
            newMonthMap.set(keyValue, sale.total);
            statsMap.set(month, newMonthMap);
        } else {
            const dayValue = monthMap.get(keyValue);
            const value = currency(sale.total).add(dayValue).value;
            monthMap.set(keyValue, value);
        }
    });
    //:;

    return statsMap;
}


export const getWeeklySaleStats = (sales: SaleInfoType[]) => {
    const map = defaultAnalyzer(sales, "ddd");

    const series: ChartSerieType[] = [];
    
    map.forEach((dailyMonth, month) => {
        const serie: ChartSerieType = { data: [], name: month };
        
        daysOfWeek.forEach(dayOfWeek => {
            const value = dailyMonth.get(dayOfWeek);
            serie.data.push(value ?? 0);
        })

        series.push(serie);
    })

    return series
}

export const getDailySaleStats = (sales: SaleInfoType[]) => {
    const map = defaultAnalyzer(sales, "DD");

    const series: ChartSerieType[] = []

    map.forEach((dailyMonth, month) => {
        const serie: ChartSerieType = { data: [], name: month };
        
        for(let i = 0; i <= 31; i++) {
            const value = dailyMonth.get(`${i < 10 ? 0 : "" }${i}`);

            serie.data.push(value ?? 0);
        }

        series.push(serie);
    })

    return series;
}