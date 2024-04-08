import { useContext  } from "react";

import { LoginContextProvider } from "@/context/LoginContext"

import LayoutContainer from "@/components/shared/layout";

const RootLayout = ({ children }) => {
    return (
        <LayoutContainer>
            <LoginContextProvider>
                { children }
            </LoginContextProvider>
        </LayoutContainer>

    );
};

export default RootLayout;
