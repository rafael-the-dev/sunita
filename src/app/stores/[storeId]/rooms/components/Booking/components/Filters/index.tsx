
import useSearchParams from "@/hooks/useSearchParams"

import Filters from "@/components/shared/filters"
import RadioGroup from "@mui/material/RadioGroup"
import RadioButton from "@/components/radio-button"
import Status from "./components/Status"

enum FILTERS {
    DATE = 'date',
    STATUS = "status"
}

const filtersList = [,
    {
        label: "Status",
        value: FILTERS.STATUS
    },
    {
        label: "Date",
        value: FILTERS.DATE
    }
]


const FiltersContainer = () => {
    const searchParams = useSearchParams()

    const filterQueryParam = searchParams.get("filter", FILTERS.STATUS)

    return (
        <Filters>
            <RadioGroup row>
                {
                    filtersList.map(filter => (
                        <RadioButton 
                            { ...filter }
                            checked={filterQueryParam === filter.value}
                            key={filter.value}
                            onChange={searchParams.changeHandler("filter", searchParams.setSearchParam)}
                        />
                    ))
                }
            </RadioGroup>
            <div className="">
                {
                    {
                        [FILTERS.DATE]: <Filters.Date />,
                        [FILTERS.STATUS]: <Status />
                    }[filterQueryParam]
                }
            </div>
            <Filters.SubmitButton />
        </Filters>
    )
}

export default FiltersContainer