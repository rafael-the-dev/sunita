import { ChangeEvent, useCallback, useMemo } from "react"

import useSearchParams from "@/hooks/useSearchParams"

import FiltersButton from "./components/FilterButton"
import SearchBox from "@/components/shared/product-search-box"

const SearchBoxContainer = () => {
    const searchParams = useSearchParams()

    const searchValue = searchParams.get("search", "")

    const filtersButtonMemo = useMemo(
        () => <FiltersButton />,
        []
    )

    const changeHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => searchParams.setSearchParam("search", e.target.value),
        [ searchParams ]
    )

    return (
        <form>
            <SearchBox>
                { filtersButtonMemo }
                <SearchBox.Input 
                    className="grow"
                    onChange={changeHandler}
                    placeholder="Insert search key"
                    value={searchValue}
                />
            </SearchBox>
        </form>
    )
}

export default SearchBoxContainer