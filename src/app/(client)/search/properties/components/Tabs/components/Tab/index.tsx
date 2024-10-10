import { useCallback } from "react"
import classNames from "classnames"

import { PropsType } from "./types"

import useTab from "../../hooks/useTab"

const Tab = ({ children, id }: PropsType) => {
    const { isActive, setTab } = useTab()

    const clickHandler = useCallback(
        () => setTab(id),
        [ id, setTab ]
    )

    return (
        <li className="w-1/2">
            <button 
                className={classNames(
                    `border-0 outline-none cursor-pointer py-3 w-full`,
                    isActive(id) ? "bg-primary-700 text-white" : "bg-transparent text-primary-700 hover:bg-primary-300 hover:text-white"
                )}
                onClick={clickHandler}>
                { children }
            </button>
        </li>
    )
}

export default Tab