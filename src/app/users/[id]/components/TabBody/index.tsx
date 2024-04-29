
import classNames from "classnames";

import styles from "./styles.module.css"
import { AnalyticsFiltersContextProvider } from "@/context/AnalyticsFilters";

import DataShow from "./components/data-show"
import Highlights from "./components/highlights";
import FiltersContainer from "./components/filters";

const TabBody = () => {

    return (
        <div className={classNames(styles.root, "overflow-y-auto pt-4")}>
            <AnalyticsFiltersContextProvider>
                <Highlights />
                <FiltersContainer />
                <div className="px-3 md:mt-24">
                    <DataShow />
                </div>
            </AnalyticsFiltersContextProvider>
        </div>
    )
}

export default TabBody