"use client"

import { ReactNode } from "react";
import { usePathname } from "next/navigation"

import Dialog from "@/components/shared/layout/components/Dialog";
import Layout from "@/components/shared/layout";
import ProtectedLayout from "@/components/shared/layout/ProtectedLayout";

const RootLayout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname()

    const isProtectedRoute = pathname.startsWith("/stores/") || pathname.startsWith("/login")

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