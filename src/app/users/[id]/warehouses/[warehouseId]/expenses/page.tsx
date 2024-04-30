"use client"

import { useContext } from "react";

import { TabsContext, TabsContextProvider } from "@/context/TabsContext";

import TabsList from "@/components/shared/tabs-list";//:;
import TabBody from "./components/TabBody";

const ExpensesPage = () => {
    const { getActiveTab } = useContext(TabsContext)

    return (
        <main>
            <TabsList />
            { getActiveTab().component }
        </main>
    );
};

const Provider = () => (
    <TabsContextProvider defaultComponent={<TabBody />}>
        <ExpensesPage />
    </TabsContextProvider>
);

export default Provider;