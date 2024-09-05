import { ChangeEvent, ReactNode, useEffect, useRef } from "react"
import classNames from "classnames"

import useSearchParams from "@/hooks/useSearchParams"

import FiltersPopover from "@/components/shared/FiltersPopover"
import IconButton from "./components/SubmitIconButton"
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
    filters?: ReactNode,
    input?: {
        className?: string,
        placeholder?: string,
        onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    },
    submitButton?: ReactNode,
}

const Container = ({ classes, className, filters, input, submitButton }: PropsType) => {
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
                { ...( input ?? {})}
                className={classNames("grow", input?.className)}
                onChange={searchParams.changeHandler("search", searchParams.setSearchParam)}
                ref={inputRef}
            />
            {
                submitButton 
            }
        </SearchBox>
    )
}

Container.IconButton = IconButton

export default Container