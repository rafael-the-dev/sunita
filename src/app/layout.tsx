import { ReactNode } from "react";
import {headers} from "next/headers"

import Dialog from "@/components/shared/layout/components/Dialog";
import Layout from "@/components/shared/layout";
import ProtectedLayout from "@/components/shared/layout/ProtectedLayout";

const RootLayout = ({ children }: { children: ReactNode }) => {
    const headersList = headers()
    const pathname = headersList.get("current-pathname")
    console.log("layout", pathname)
    const isProtectedRoute = (
        () => {
            const protectedRoutes = [ "/stores", "/system", "/login" ]

            const isProtected = Boolean(protectedRoutes.find(route => pathname?.startsWith(route)))

            return isProtected
        }
    )()

    if(isProtectedRoute) return (
        <ProtectedLayout>
            { children }
        </ProtectedLayout>
    )
    
    /*if(["/" ].includes(pathname)) {
        const searchParams = headersList.get("current-search-params")

        return (
            <PropertiesSSR queryParams={searchParams}>
                <Layout>
                    { children }
                </Layout>
            </PropertiesSSR>
        )
    }*/

    const propertyRoutePattern = /^\/search\/properties\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/

    if(propertyRoutePattern.test(pathname) || [ "/", "/search/properties"].includes(pathname)) {
       return children
    }

    return (
        <Layout>
            { children }
            <Dialog />
        </Layout>
    )
}

export default RootLayout