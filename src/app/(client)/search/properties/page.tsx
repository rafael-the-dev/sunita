
import { headers } from "next/headers"

import Layout from "@/components/shared/layout"
import PropertiesSSC from "@/app/ServerSideContainers/Properties"
import View from "./View"

const PropertyPage = () => {
    const headersList = headers()

    return (
        <PropertiesSSC
            queryParams={{}}>
            <Layout>
                <View />
            </Layout>
        </PropertiesSSC>
    )
}

export default PropertyPage