"use client"

import { ReactNode } from "react";
import { usePathname } from "next/navigation"

import Dialog from "@/components/shared/layout/components/Dialog";
import Layout from "@/components/shared/layout";
import ProtectedLayout from "@/components/shared/layout/ProtectedLayout";

const RootLayout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname()

    const isProtectedRoute = (
        () => {
            const protectedRoutes = [ "/stores", "/system", "/login" ]

            const isProtected = Boolean(protectedRoutes.find(route => pathname.startsWith(route)))

            return isProtected
        }
    )()

    if(isProtectedRoute) return (
        <ProtectedLayout>
            { children }
        </ProtectedLayout>
    )

    return (
        <Layout>
            { children }
            <Dialog />
        </Layout>
    )
}

export default RootLayout