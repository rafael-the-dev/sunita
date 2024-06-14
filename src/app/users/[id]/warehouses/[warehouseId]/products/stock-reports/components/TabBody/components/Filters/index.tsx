import { ReactNode, useCallback, useMemo, useRef, useState } from "react"
import RadioGroup from "@mui/material/RadioGroup"

import { getId } from "@/helpers/id"

import Filters from "@/components/shared/filters"
import RadioButton from "@/components/radio-button"
import SearchField from "./components/SearchField"

enum FILTERS {
    DATE,
    PRODUCTS
}

const filtersList = [
    {
        label: "Date",
        value: FILTERS.DATE
    },
    {
        label: "Products",
        value: FILTERS.PRODUCTS
    }
]

const FiltersContainer = () => {
    const [ filter, setFilter ] = useState(FILTERS.DATE)

    const changeHandler = useCallback((id: FILTERS) => () => setFilter(id), [])

    const searchFieldMemo = useMemo(() => <SearchField key={getId()} />, [])

    const filtersMapper = useRef(new Map<FILTERS, ReactNode>([ 
        [ FILTERS.DATE, <Filters.Date key={getId()} /> ],
        [ FILTERS.PRODUCTS, searchFieldMemo ]
    ]))

    return (
        <Filters>
            <RadioGroup row>
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
            <div className="mt-4 relative">
                { filtersMapper.current.get(filter) }
            </div>
            <Filters.SubmitButton />
        </Filters>
    )
}

export default FiltersContainer

