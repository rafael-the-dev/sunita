import { MouseEvent, ReactNode, useCallback, useRef } from "react"
import classNames from "classnames"
import IconButton from "@mui/material/IconButton"

import FilterIcon from "@mui/icons-material/FilterAlt"

import Popover from "@/components/popover"

type PropsType = {
    children: ReactNode,
    classes?: {
        button?: string;
        popover?: {
            paper: string;
            root: string
        }
    }
}

const Filters = ({ children, classes }: PropsType) => {
    const onOpenFuncRef = useRef<(e: MouseEvent<HTMLButtonElement>) => void>(null)

    const clickHandler = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => onOpenFuncRef.current?.(e),
        []
    )

    return (
        <>
            <IconButton
                className={classNames(classes?.button)}
                onClick={clickHandler}>
                <FilterIcon />
            </IconButton>
            <Popover
                classes={classes?.popover}
                id="filter popover"
                onClickRef={onOpenFuncRef}>
                { children }
            </Popover>
        </>
    )
}

export default Filters