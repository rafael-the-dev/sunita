import { AnalyticsType } from "@/types/analytics";
import { ChartSeriesType } from "@/types/chart";
import { UserType } from "@/types/user";

export type AnalyticsContextType = {
    dailySalesStats: ChartSeriesType;
    fetchData: ({ options, path, signal }: { options?: RequestInit, path?: string, signal?: AbortSignal }) => Promise<void>
    getAnalytics: () => AnalyticsType;
    getUsers: () => UserType[];
    loading: boolean;
    weeklySalesStats: ChartSeriesType;
}