import * as React from "react";


import { AnalyticsContextType } from "./types"
import useFech from "@/hooks/useFetch";
import { LoginContext } from "../LoginContext";
import { AnalyticsType } from "@/types/analytics";

export const AnalyticsContext = React.createContext<AnalyticsContextType | null>(null);
AnalyticsContext.displayName = "AnalyticsContext";

export const AnalyticsContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { credentials } = React.useContext(LoginContext)

    const { data } = useFech<AnalyticsType>({ 
        url: `/api/users/${credentials?.user?.username }/warehouses/12345/analytics`
    });

    const getAnalytics = React.useCallback(() => data, [ data ]);

    return (
        <AnalyticsContext.Provider
            value={{
                getAnalytics
            }}>
            { children }
        </AnalyticsContext.Provider>
    )
};