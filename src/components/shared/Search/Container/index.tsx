import { ChangeEvent, ReactNode, useEffect, useRef } from "react"

import useSearchParams from "@/hooks/useSearchParams"

import FiltersPopover from "@/components/shared/FiltersPopover"
import SearchBox from "@/components/shared/product-search-box"

type PropsType = {
    classes?: {
        filters?: {
            button?: string,
            popover?: {
                paper: string,
                root: string
            }
        }
    },
    className?: string,
    filters?: ReactNode
}

const Container = ({ classes, className, filters }: PropsType) => {
    const searchParams = useSearchParams()

    const isFirstRender = useRef(true)
    const inputRef = useRef<HTMLInputElement>(null)

    const search = searchParams.get("search", "")

    useEffect(
        () => {
            if(isFirstRender.current && inputRef.current) {
                inputRef.current.value = search
                isFirstRender.current = false
            }   
        },
        [ search ]
    )

    return (
        <SearchBox
            className={className}>
            { filters && <FiltersPopover classes={classes?.filters}>{ filters }</FiltersPopover>}
            <SearchBox.Input 
                className="grow"
                onChange={searchParams.changeHandler("search", searchParams.setSearchParam)}
                placeholder="Insert room's name or type"
                ref={inputRef}
            />
        </SearchBox>
    )
}

export default Container