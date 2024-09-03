import * as React from "react";

import { LoginContext } from "../LoginContext";

import { AnalyticsType } from "@/types/analytics";
import { AnalyticsContextType } from "./types"
import { ChartSeriesType } from "@/types/chart";
import { UserType } from "@/types/user";

import useFetch from "@/hooks/useFetch";
import { getDailySaleStats, getWeeklySaleStats, monthlySalesStats } from "./helpers/sales";
import { getDailyExpensesStats, getWeeklyExpensesStats } from "./helpers/expenses";

export const AnalyticsContext = React.createContext<AnalyticsContextType | null>(null);
AnalyticsContext.displayName = "AnalyticsContext";

const initialStats = { expenses: [], profit: [], total: [] };

export const AnalyticsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { credentials } = React.useContext(LoginContext)

    const { data, fetchData, loading } = useFetch<AnalyticsType>({ 
        url: `/api/stores/${credentials?.user.stores[0].storeId}/analytics`
    });

    const usersResponse = useFetch<UserType[]>({ 
        url: `/api/stores/${credentials?.user.stores[0].storeId}/users`
    });

    const usersList = usersResponse?.data

    const getAnalytics = React.useCallback(() => data, [ data ]);
    const getUsers = React.useCallback(() => usersList ?? [], [ usersList ])

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

    const fetchUsers = usersResponse.fetchData

    React.useEffect(
        () => {
            const controller = new AbortController()

            const timeout = setTimeout(
                () => fetchUsers({ signal: controller.signal }),
                40000
            )

            return () => {
                clearTimeout(timeout)
                controller.abort()
            }
        },
        [ fetchUsers ]
    )

    return (
        <AnalyticsContext.Provider
            value={{
                dailySalesStats,
                loading,
                weeklySalesStats,
                
                fetchData,
                getAnalytics,
                getUsers
            }}>
            { children }
        </AnalyticsContext.Provider>
    )
};