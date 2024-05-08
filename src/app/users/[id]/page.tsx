'use client'

import { AnalyticsContextProvider } from "@/context/AnalyticsContext";

import TabBody from "./components/TabBody";

import TabBodyContainer from "@/components/shared/tab-body-container"

const Container = () => <TabBodyContainer component={<AnalyticsContextProvider><TabBody /></AnalyticsContextProvider>} />;

export default Container;