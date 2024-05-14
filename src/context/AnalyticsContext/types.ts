import { AnalyticsType } from "@/types/analytics";
import { ChartSeriesType } from "@/types/chart";

export type AnalyticsContextType = {
    dailySalesStats: ChartSeriesType;
    fetchData: ({ options, path, signal }: { options?: RequestInit, path?: string, signal?: AbortSignal }) => Promise<void>
    getAnalytics: () => AnalyticsType;
    loading: boolean;
    weeklySalesStats: ChartSeriesType;
}