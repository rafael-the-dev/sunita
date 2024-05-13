import { AnalyticsType } from "@/types/analytics";
import { ChartSerieType } from "@/types/chart";


export type AnalyticsContextType = {
    dailySalesStats: ChartSerieType[];
    fetchData: ({ options, path, signal }: { options?: RequestInit, path?: string, signal?: AbortSignal }) => Promise<void>
    getAnalytics: () => AnalyticsType;
    loading: boolean;
    weeklySalesStats: ChartSerieType[];
}