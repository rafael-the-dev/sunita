import * as React from "react"

import useSearchParams from "@/hooks/useSearchParams"

import RadioGroup from "@/common/components/RadioGroup"

enum X_AXIS {
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year"
}

const XAxis = () => {
    const searchParams = useSearchParams()

    const list = React.useRef(
        [
            { label: "Day", value: X_AXIS.DAY },
            { label: "Week", value: X_AXIS.WEEK },
            { label: "Month", value: X_AXIS.MONTH },
            { label: "Year", value: X_AXIS.YEAR },
        ]
    )

    const selectedValue = searchParams.get("x-axis", X_AXIS.DAY)

    const isSelected = React.useCallback(
        (id: X_AXIS) => searchParams.isChecked(selectedValue, id),
        [ selectedValue, searchParams ]
    )

    return (
        <RadioGroup 
            isSelected={isSelected}
            list={list}
            onChange={searchParams.changeHandler("x-axis", searchParams.setSearchParam)}
        />
    )
}

export default XAxis