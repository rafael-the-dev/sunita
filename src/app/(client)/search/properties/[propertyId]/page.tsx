
import { headers } from "next/headers"

import Layout from "@/components/shared/layout"
import Property from "@/app/ServerSideContainers/PropertyById"
import PropertiesSSC from "@/app/ServerSideContainers/Properties"
import View from "./View"

const PropertyPage = () => {
    const headersList = headers()
    const pathname = headersList.get("current-pathname")

    const id = pathname.split("/search/properties/")[1]

    return (
        <Property
            id={id}
            PropertiesSSC={PropertiesSSC}
            queryParams={{}}>
            <Layout>
                <View />
            </Layout>
        </Property>
    )
}

export default PropertyPage