
import { headers } from "next/headers"

import Layout from "@/components/shared/layout"
import PropertiesSSC from "@/app/ServerSideContainers/Properties"
import View from "./views/Home"

const HomePage = () => {
    const headersList = headers()

    const searchParams = headersList.get("current-search-params")

    return (
        <PropertiesSSC
            queryParams={searchParams}>
            <Layout>
                <View />
            </Layout>
        </PropertiesSSC>
    )
}

export default HomePage