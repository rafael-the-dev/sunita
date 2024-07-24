import { ReactNode, useCallback } from "react"
import classNames from "classnames"

import { PropsType } from "./types"

import useSearchParams from "@/hooks/useSearchParams"

const Tab = ({ activeTab, children, id }: PropsType) => {
    const searchParams = useSearchParams()

    const isActive = id === activeTab

    const clickHandler = useCallback(
        () => searchParams.setSearchParam("tab", id),
        [ id, searchParams ]
    )

    return (
        <li className="w-1/2">
            <button 
                className={classNames(
                    `border-0 outline-none py-2 w-full`,
                    isActive ? "bg-primary-700 text-white" : "bg-transparent text-primary-700"
                )}
                onClick={clickHandler}>
                { children }
            </button>
        </li>
    )
}

export default Tab