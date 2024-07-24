
import { TABS } from "./components/Tab/types"

import useSearchParams from "@/hooks/useSearchParams"

import Tab from "./components/Tab"


const Tabs = () => {
    const searchParams = useSearchParams()

    const activeTab = searchParams.get("tab", TABS.LIST)

    return (
        <ul className="flex items-stretch my-4">
            <Tab
                activeTab={activeTab}
                id={TABS.LIST}>
                List
            </Tab>
            <Tab
                activeTab={activeTab}
                id={TABS.MAP}>
                Map
            </Tab>
        </ul>
    )
}

export default Tabs