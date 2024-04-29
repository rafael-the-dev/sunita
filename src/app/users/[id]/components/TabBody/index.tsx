
import classNames from "classnames";

import styles from "./styles.module.css"
import { AnalyticsFiltersContextProvider } from "@/context/AnalyticsFilters";

import DataShow from "./components/data-show"
import Highlights from "./components/highlights";
import FiltersContainer from "./components/filters";
import useSearchParams from "@/hooks/useSearchParams";

const TabBody = () => {
    const hasCollapse = useSearchParams().get("collapse", false)
    
    return (
        <div className={classNames(styles.root, "overflow-y-auto pt-4")}>
            <AnalyticsFiltersContextProvider>
                <Highlights />
                <FiltersContainer />
                <div className={classNames("px-3", hasCollapse ? "md:mt-8" : "md:mt-24")}>
                    <DataShow />
                </div>
            </AnalyticsFiltersContextProvider>
        </div>
    )
}

export default TabBody