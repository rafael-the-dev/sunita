"use client"

import { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import "@/styles/reset.css";

import 'devextreme/dist/css/dx.light.css';

import "@/styles/tailwind.css";
import "@/styles/globals.css";

import { theme } from "@/components/shared/layout/mui/theme";
import { AppContextProvider } from "@/context/AppContext";

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider options={{  enableCssLayer: true  }}>
                    <ThemeProvider theme={theme}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <AppContextProvider>
                                { children }
                            </AppContextProvider>
                        </LocalizationProvider>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
};

export default RootLayout;