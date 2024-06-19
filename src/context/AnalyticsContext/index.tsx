import * as React from "react";

import { LoginContext } from "../LoginContext";

import { AnalyticsType } from "@/types/analytics";
import { AnalyticsContextType } from "./types"
import { ChartSeriesType } from "@/types/chart";

import useFetch from "@/hooks/useFetch";
import { getDailySaleStats, getWeeklySaleStats, monthlySalesStats } from "./helpers/sales";
import { getDailyExpensesStats, getWeeklyExpensesStats } from "./helpers/expenses";

export const AnalyticsContext = React.createContext<AnalyticsContextType | null>(null);
AnalyticsContext.displayName = "AnalyticsContext";

const initialStats = { expenses: [], profit: [], total: [] };

export const AnalyticsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { credentials } = React.useContext(LoginContext)

    const { data, fetchData, loading } = useFetch<AnalyticsType>({ 
        url: `/api/stores/12345/analytics`
    });

    const getAnalytics = React.useCallback(() => data, [ data ]);

    const saleStats = React.useMemo(() => {
        const analytics = getAnalytics()


        if(!analytics) return new Map<string, number>();

        const result = monthlySalesStats(analytics.sales.list);

        return result;
    }, [ getAnalytics ]);

    const weeklySalesStats: ChartSeriesType = React.useMemo(() => {
        const analytics = getAnalytics();

        if(!analytics) return initialStats;

        return {
            ...getWeeklySaleStats(analytics.sales.list),
            expenses: getWeeklyExpensesStats(analytics.expenses.list)
        };
    }, [ getAnalytics ]);

    const dailySalesStats: ChartSeriesType = React.useMemo(() => {
        const analytics = getAnalytics();

        if(!analytics) return initialStats;

        return {
            ...getDailySaleStats(analytics.sales.list),
            expenses: getWeeklyExpensesStats(analytics.expenses.list)
        }
    }, [ getAnalytics ]);

    return (
        <AnalyticsContext.Provider
            value={{
                dailySalesStats,
                loading,
                weeklySalesStats,
                
                fetchData,
                getAnalytics
            }}>
            { children }
        </AnalyticsContext.Provider>
    )
};