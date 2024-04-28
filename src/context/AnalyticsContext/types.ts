import { AnalyticsType } from "@/types/analytics";


export type AnalyticsContextType = {
    getAnalytics: () => AnalyticsType;
}