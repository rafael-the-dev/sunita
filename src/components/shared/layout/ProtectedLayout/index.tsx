'use client';

import { LoginContextProvider } from "@/context/LoginContext";

import Content from "./components/content"
import Dialog from "@/components/shared/layout/components/Dialog";
import ExpiredTokenDialog from '@/components/shared/layout/components/ExpiredTokenDialog';
import LayoutContainer from "@/components/shared/layout";

const ProtectedLayout = ({ children }) => {

    return (
        <LayoutContainer>
            <LoginContextProvider>
                <Content>
                    { children }
                </Content>
                <Dialog />
                <ExpiredTokenDialog />
            </LoginContextProvider>
        </LayoutContainer>

    );
};

export default ProtectedLayout;
