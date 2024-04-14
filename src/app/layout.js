'use client';

import { useContext  } from "react";
import { usePathname } from "next/navigation";
import Hidden from "@mui/material/Hidden";

import { LoginContextProvider } from "@/context/LoginContext";

import ExpiredTokenDialog from '@/components/shared/layout/components/ExpiredTokenDialog';
import LayoutContainer from "@/components/shared/layout";
import Sidebar from "@/components/shared/side-bar";

const RootLayout = ({ children }) => {
    const pathname = usePathname();

    const isLoginPage = pathname === "/login";

    return (
        <LayoutContainer>
            <LoginContextProvider>
                <div className="md:flex">
                    { 
                        !isLoginPage && (
                            <Hidden mdDown>
                                <Sidebar />
                            </Hidden>
                        )
                    }
                    { children }
                </div>
                <ExpiredTokenDialog />
           </LoginContextProvider>
        </LayoutContainer>

    );
};

export default RootLayout;
