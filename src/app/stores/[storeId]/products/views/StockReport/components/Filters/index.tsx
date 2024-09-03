import { ReactNode, useCallback, useContext, useMemo, useRef, useState } from "react"
import RadioGroup from "@mui/material/RadioGroup"

import styles from "./styles.module.css"

import { ProductsPageContext } from "../../../../context"

import Filters from "@/components/shared/filters"
import RadioButton from "@/components/radio-button"
import SearchField from "./components/SearchField"

enum FILTERS {
    DATE = "date",
    PRODUCTS = "products",
    USER = "users"
}

const filtersList = [
    {
        label: "Date",
        value: FILTERS.DATE
    },
    {
        label: "Products",
        value: FILTERS.PRODUCTS
    },
    {
        label: "User",
        value: FILTERS.USER
    }
]

const FiltersContainer = () => {
    const { users } = useContext(ProductsPageContext)

    const [ filter, setFilter ] = useState(FILTERS.DATE)

    const changeHandler = useCallback((id: FILTERS) => () => setFilter(id), [])

    const searchFieldMemo = useMemo(() => <SearchField key={1} />, [])

    const filtersMapper = useRef(new Map<FILTERS, ReactNode>([ 
        [ FILTERS.DATE, <Filters.Date key={0} /> ],
        [ FILTERS.PRODUCTS, searchFieldMemo ],
        [ FILTERS.USER, <Filters.User className="w-full sm:max-w-sm" key={2} /> ]
    ]))

    return (
        <Filters className={styles.container}>
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
                {
                    { 
                        [FILTERS.DATE]: <Filters.Date key={0} />,
                        [FILTERS.PRODUCTS]: searchFieldMemo,
                        [FILTERS.USER]: <Filters.User list={ users.data } className="w-full sm:max-w-sm" key={2} refetchUsers={users.fetchData} />
                    }[filter]
                }
            </div>
            <Filters.SubmitButton />
        </Filters>
    )
}

export default FiltersContainer

