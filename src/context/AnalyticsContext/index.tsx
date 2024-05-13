import * as React from "react";


import { AnalyticsContextType } from "./types"
import useFech from "@/hooks/useFetch";
import { LoginContext } from "../LoginContext";
import { AnalyticsType } from "@/types/analytics";
import { getDailySaleStats, getWeeklySaleStats, monthlySalesStats } from "./helper";
import { getSalesStats } from "@/helpers/analytics";
import { ChartSerieType } from "@/types/chart";

export const AnalyticsContext = React.createContext<AnalyticsContextType | null>(null);
AnalyticsContext.displayName = "AnalyticsContext";

export const AnalyticsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { credentials } = React.useContext(LoginContext)

    const { data, fetchData, loading } = useFech<AnalyticsType>({ 
        url: `/api/users/${credentials?.user?.username }/warehouses/12345/analytics`
    });

    const getAnalytics = React.useCallback(() => data, [ data ]);

    const saleStats = React.useMemo(() => {
        const analytics = getAnalytics()


        if(!analytics) return new Map<string, number>();

        const result = monthlySalesStats(analytics.sales.list);

        return result;
    }, [ getAnalytics ]);

    const weeklySalesStats: ChartSerieType[] = React.useMemo(() => {
        const analytics = getAnalytics();

        if(!analytics) return [];

        return getWeeklySaleStats(analytics.sales.list);
    }, [ getAnalytics ]);

    const dailySalesStats: ChartSerieType[] = React.useMemo(() => {
        const analytics = getAnalytics();

        if(!analytics) return [];

        return getDailySaleStats(analytics.sales.list);
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