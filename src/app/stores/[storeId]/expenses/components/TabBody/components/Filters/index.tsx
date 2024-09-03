import { ChangeEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react"
import RadioGroup from "@mui/material/RadioGroup"

import { getId } from "@/helpers/id"
import useSearchParams from "@/hooks/useSearchParams"

import Categories from "@/components/shared/expenses-categories"
import Filters from "@/components/shared/filters"
import RadioButton from "@/components/radio-button"

enum FILTERS {
    CATEGORIES,
    DATE
}

const filtersList = [
    {
        label: "Date",
        value: FILTERS.DATE
    },
    {
        label: "Category",
        value: FILTERS.CATEGORIES
    }
]

const FiltersContainer = () => {
    const [ filter, setFilter ] = useState(FILTERS.DATE)

    const searchParams = useSearchParams()

    const category = searchParams.get("category", "-1")
    
    const changeHandler = useCallback((id: FILTERS) => () => setFilter(id), [])

    const categoryChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        
        if(typeof value === "number" && parseInt(value) === -1) searchParams.removeSearchParam("category")
        else searchParams.setSearchParam("category", value)
    }, [ searchParams ])

    const filtersMapper = new Map<FILTERS, ReactNode>([
        [ FILTERS.DATE, <Filters.Date key={getId()} /> ],
        [ FILTERS.CATEGORIES,  <Categories key={getId()} value={category} onChange={categoryChangeHandler} /> ]
    ])

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
            <div className="mt-4">
                { filtersMapper.get(filter) }
            </div>
            <Filters.SubmitButton />
        </Filters>
    )
}

export default FiltersContainer

