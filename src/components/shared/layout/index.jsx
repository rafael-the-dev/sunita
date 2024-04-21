import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import "@/styles/reset.css";
import "@/styles/tailwind.css";
import "@/styles/globals.css";

import { theme } from "./mui/theme";
import { AppContextProvider } from "@/context/AppContext";

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider options={{  enableCssLayer: true  }}>
                    <ThemeProvider theme={theme}>
                        <AppContextProvider>
                            { children }
                        </AppContextProvider>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
};

export default RootLayout;
