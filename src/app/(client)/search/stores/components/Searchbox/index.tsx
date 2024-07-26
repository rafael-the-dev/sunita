import { ChangeEvent, useCallback, useEffect, useMemo, useRef } from "react"
import IconButton from "@mui/material/IconButton"

import SearchIcon from "@mui/icons-material/Search"

import useSearchParams from "../../hooks/useSearchParams"

import FiltersButton from "./components/FilterButton"
import SearchBox from "@/components/shared/product-search-box"

const SearchBoxContainer = () => {
    const { changeHandler, searchParams } = useSearchParams()

    const inputRef = useRef<HTMLInputElement>(null)
    const isFirstRender = useRef(true)

    const searchValue = searchParams.get("search", "")

    const filtersButtonMemo = useMemo(
        () => <FiltersButton />,
        []
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
                    onChange={changeHandler("search", searchParams.setSearchParam)}
                    placeholder="Insert search key"
                    ref={inputRef}
                />
                <IconButton
                    type="submit">
                    <SearchIcon />
                </IconButton>
            </SearchBox>
        </form>
    )
}

export default SearchBoxContainer