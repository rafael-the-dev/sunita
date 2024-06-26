import classNames from "classnames";

import styles from "./styles.module.css"
import { AnalyticsFiltersContextProvider } from "@/context/AnalyticsFilters";

import DataShow from "./components/data-show";
import FiltersButton from "./components/filters-button"
import Highlights from "./components/DesktopHighlights";
import FiltersContainer from "./components/filters";
import useSearchParams from "@/hooks/useSearchParams";

const TabBody = () => {

    const hasCollapse = useSearchParams().get("collapse", false)

    return (
        <div className={classNames(styles.root, "overflow-y-auto pt-4")}>
            <AnalyticsFiltersContextProvider>
                <Highlights />
                <FiltersButton />
                <FiltersContainer />
                <div className={classNames(styles.content, "mt-8 mb-16 mx-3 pt-3 pb-5 px-3 rounded-md md:mb-8 xl:mx-4 xl:px-4", hasCollapse ? "md:mt-8" : "xl:mt-28")}>
                    <DataShow />
                </div>
            </AnalyticsFiltersContextProvider>
        </div>
    )
}

export default TabBody