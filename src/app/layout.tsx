'use client';

import Content from "./components/content"
import Dialog from "@/components/shared/layout/components/Dialog";
import ExpiredTokenDialog from '@/components/shared/layout/components/ExpiredTokenDialog';
import LayoutContainer from "@/components/shared/layout";

const RootLayout = ({ children }) => {

    return (
        <LayoutContainer>
            <Content>
                { children }
            </Content>
            <Dialog />
            <ExpiredTokenDialog />
        </LayoutContainer>

    );
};

export default RootLayout;
