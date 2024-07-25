import { TABS } from "./components/Tab/types"

import Tab from "./components/Tab"

const Tabs = () => {
    return (
        <ul className="flex items-stretch my-4">
            <Tab
                id={TABS.LIST}>
                List
            </Tab>
            <Tab
                id={TABS.MAP}>
                Map
            </Tab>
        </ul>
    )
}

export default Tabs