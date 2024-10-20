import * as React from "react"

import useSearchParams from "@/hooks/useSearchParams"

import RadioGroup from "@/common/components/RadioGroup"

enum Y_AXIS {
    BOOKINGS = "bookings"
}

const YAxis = () => {
    const searchParams = useSearchParams()

    const list = React.useRef(
        [
            { label: "Bookings", value: Y_AXIS.BOOKINGS }
        ]
    )

    const selectedValue = searchParams.get("y-axis", Y_AXIS.BOOKINGS)

    const isSelected = React.useCallback(
        (id: Y_AXIS) => searchParams.isChecked(selectedValue, id),
        [ selectedValue, searchParams ]
    )

    return (
        <RadioGroup 
            isSelected={isSelected}
            list={list}
            onChange={searchParams.changeHandler("y-axis", searchParams.setSearchParam)}
        />
    )
}

export default YAxis