import { useCallback, useContext } from "react";
import classNames from "classnames"
import Hidden from "@mui/material/Hidden";

import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { AnalyticsFiltersContext } from "@/context/AnalyticsFilters";

import Button from "@/components/shared/button";

const Container = () => {
    const { onToggleCollapse } = useContext(AnalyticsFiltersContext)


    const toggleHandler = useCallback(() => onToggleCollapse.current?.(), [ onToggleCollapse ])

    return (
        <div className="mx-4 mb-4 mt-24 md:mt-20">
            <Hidden xlUp>
                <Button
                    className={classNames(` 
                        h-full rounded-md py-4 text-black w-full hover:bg-primary-700 hover:text-white`)}
                    onClick={toggleHandler}
                    startIcon={<FilterAltIcon />}
                    variant="outlined">
                    Filters
                </Button>
            </Hidden>
        </div>
    )
}

export default Container