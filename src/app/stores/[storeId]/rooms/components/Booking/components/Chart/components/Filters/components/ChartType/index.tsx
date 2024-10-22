import * as React from "react"

import { CHART_TYPE } from "@/app/stores/[storeId]/rooms/components/Booking/components/Chart/components/Filters/types"

import useSearchParams from "@/hooks/useSearchParams"

import RadioGroup from "@/common/components/RadioGroup"

const ChartType = () => {
    const searchParams = useSearchParams()

    const list = React.useRef(
        [
            { label: "Bar", value: CHART_TYPE.BAR },
            { label: "Line", value: CHART_TYPE.LINE }
        ]
    )

    const selectedValue = searchParams.get("chart-type", CHART_TYPE.LINE)

    const isSelected = React.useCallback(
        (id: CHART_TYPE) => searchParams.isChecked(selectedValue, id),
        [ selectedValue, searchParams ]
    )

    return (
        <RadioGroup 
            isSelected={isSelected}
            list={list}
            onChange={searchParams.changeHandler("chart-type", searchParams.setSearchParam)}
        />
    )
}

export default ChartType