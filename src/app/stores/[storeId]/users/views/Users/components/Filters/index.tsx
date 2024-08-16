import { ChangeEvent, MouseEvent, useRef } from "react";
import IconButton from "@mui/material/IconButton";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";

import useSearchParam from "@/hooks/useSearchParams";

import AdvancedFiltes from "./components/AdvancedFilters";
import Popover from "@/components/popover";

const Filters = () => {
    const searchParams = useSearchParam();

    const onOpenRef = useRef<(e: MouseEvent<HTMLButtonElement>) => void>(null);

    const value = searchParams.get("search", "");

    const clickHandler = (e: MouseEvent<HTMLButtonElement>) => onOpenRef.current?.(e);
    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => searchParams.setSearchParam("search", e.target.value);

    return (
        <form>
            <div className="border border-primary-700 border-solid flex items-center pr-1 py-2 sm:px-2 ">
                <IconButton 
                    onClick={clickHandler}
                    type="button">
                    <FilterAltIcon className="opacity-70" />
                </IconButton>
                <input 
                    className="border-0 grow outline-none text-small"
                    onChange={changeHandler}
                    placeholder="Insert username or position"
                />
                <SearchIcon className="opacity-70" />
            </div>
            <Popover
                id="filters"
                onClickRef={onOpenRef}>
                <AdvancedFiltes />
            </Popover>
        </form>
    )
}

export default Filters