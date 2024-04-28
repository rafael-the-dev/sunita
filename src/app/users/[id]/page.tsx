'use client'

import { useContext } from "react";

import { TabsContext, TabsContextProvider } from "@/context/TabsContext";

import TabBody from "./components/TabBody";
import TabsList from "@/components/shared/tabs-list";
import { AnalyticsContextProvider } from "@/context/AnalyticsContext";

const AnalyticsPage = () => {
    const { getActiveTab } = useContext(TabsContext);

    return (
        <main>
            <TabsList />
            { getActiveTab().component }
        </main>
    );
};

const ContextWrapper = () => (
    <AnalyticsContextProvider>
        <TabsContextProvider defaultComponent={<TabBody />}>
            <AnalyticsPage />
        </TabsContextProvider>
    </AnalyticsContextProvider>
);

export default ContextWrapper;