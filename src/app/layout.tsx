'use client';

import { useContext  } from "react";
import { usePathname } from "next/navigation";
import Hidden from "@mui/material/Hidden";

import { LoginContextProvider } from "@/context/LoginContext";

import Dialog from "@/components/shared/layout/components/Dialog";
import ExpiredTokenDialog from '@/components/shared/layout/components/ExpiredTokenDialog';
import Header from "@/components/shared/header";
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
                    <div className="grow">
                        { !isLoginPage && <Header /> }
                        { children }
                    </div>
                </div>
                <Dialog />
                <ExpiredTokenDialog />
           </LoginContextProvider>
        </LayoutContainer>

    );
};

export default RootLayout;
