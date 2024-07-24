import { ChangeEvent, useCallback, useEffect, useMemo, useRef } from "react"

import useSearchParams from "@/hooks/useSearchParams"

import FiltersButton from "./components/FilterButton"
import SearchBox from "@/components/shared/product-search-box"

const SearchBoxContainer = () => {
    const searchParams = useSearchParams()
    const inputRef = useRef<HTMLInputElement>(null)
    const isFirstRender = useRef(true)

    const searchValue = searchParams.get("search", "")

    const filtersButtonMemo = useMemo(
        () => <FiltersButton />,
        []
    )

    const changeHandler = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => searchParams.setSearchParam("search", e.target.value),
        [ searchParams ]
    )

    useEffect(
        () => {
            if(isFirstRender.current && inputRef.current) {
                inputRef.current.value = searchValue;
                isFirstRender.current = false;
            }
        }, 
        [ searchValue ]
    )

    return (
        <form>
            <SearchBox>
                { filtersButtonMemo }
                <SearchBox.Input 
                    className="grow"
                    onChange={changeHandler}
                    placeholder="Insert search key"
                    ref={inputRef}
                />
            </SearchBox>
        </form>
    )
}

export default SearchBoxContainer