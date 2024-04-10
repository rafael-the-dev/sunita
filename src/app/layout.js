import { useContext  } from "react";

import { LoginContextProvider } from "@/context/LoginContext";

import ExpiredTokenDialog from '@/components/shared/layout/components/ExpiredTokenDialog';
import LayoutContainer from "@/components/shared/layout";

const RootLayout = ({ children }) => {
    return (
        <LayoutContainer>
            <LoginContextProvider>
                { children }
                <ExpiredTokenDialog />
           </LoginContextProvider>
        </LayoutContainer>

    );
};

export default RootLayout;
