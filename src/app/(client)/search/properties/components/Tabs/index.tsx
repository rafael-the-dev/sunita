
import {LANGUAGE} from "@/types/language"
import { TABS } from "./components/Tab/types"

import useLanguage from "@/hooks/useLanguage"

import Tab from "./components/Tab"

const Tabs = () => {
    const { translate } = useLanguage()

    return (
        <ul className="flex items-stretch my-4">
            <Tab
                id={TABS.LIST}>
                {
                    translate(
                        {
                            [LANGUAGE.ENGLISH]: "List",
                            [LANGUAGE.PORTUGUESE]: "Lista"
                        }
                    )
                }
            </Tab>
            <Tab
                id={TABS.MAP}>
                {
                    translate(
                        {
                            [LANGUAGE.ENGLISH]: "Map",
                            [LANGUAGE.PORTUGUESE]: "Mapa"
                        }
                    )
                }
            </Tab>
        </ul>
    )
}

export default Tabs