import { ReactNode, useCallback, useRef, useState } from "react"
import RadioGroup from "@mui/material/RadioGroup"

import Filters from "@/components/shared/filters"
import RadioButton from "@/components/radio-button"
import { getId } from "@/helpers/id"

enum FILTERS {
    DATE
}

const filtersList = [
    {
        label: "Date",
        value: FILTERS.DATE
    }
]

const FiltersContainer = () => {
    const [ filter, setFilter ] = useState(FILTERS.DATE)

    const changeHandler = useCallback((id: FILTERS) => () => setFilter(id), [])

    const filtersMapper = useRef(new Map<FILTERS, ReactNode>([ [ FILTERS.DATE, <Filters.Date key={getId()} /> ] ]))

    return (
        <Filters>
            <RadioGroup>
                {
                    filtersList.map(item => (
                        <RadioButton 
                            { ...item }
                            checked={item.value === filter}
                            key={item.value}
                            onChange={changeHandler(item.value)}
                        />
                    ))
                }
            </RadioGroup>
            <div className="mt-4">
                { filtersMapper.current.get(filter) }
            </div>
            <Filters.SubmitButton />
        </Filters>
    )
}

export default FiltersContainer

