import { AnalyticsType } from "@/types/analytics";


export type AnalyticsContextType = {
    fetchData: ({ options, path, signal }: { options?: RequestInit, path?: string, signal?: AbortSignal }) => Promise<void>
    getAnalytics: () => AnalyticsType;
    loading: boolean;
}