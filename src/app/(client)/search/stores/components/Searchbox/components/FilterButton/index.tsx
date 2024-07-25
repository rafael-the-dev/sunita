import { MouseEvent, useCallback, useRef } from "react"
import Hidden from "@mui/material/Hidden"
import IconButton from "@mui/material/IconButton"

import FilterIcon from '@mui/icons-material/FilterAlt';

import Filters from "../../../Filters"
import Popover from "@/components/popover"

const Container = () => {
    const onOpenFuncRef = useRef<(e: MouseEvent<HTMLButtonElement>) => {}>(null)

    const clickHandler = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => onOpenFuncRef.current?.(e),
        []
    )

    return (
        <>
            <Hidden lgUp>
                <IconButton
                    className="p-2"
                    onClick={clickHandler}>
                    <FilterIcon />
                </IconButton>
                <Popover
                    id="Filters-popover"
                    onClickRef={onOpenFuncRef}>
                    <Filters />
                </Popover>
            </Hidden>
        </>
    )
}

export default Container