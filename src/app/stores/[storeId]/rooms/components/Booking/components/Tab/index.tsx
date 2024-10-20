import { ReactNode } from "react"
import classNames from "classnames"

import { TABS } from "./types"

import useSearchParams from "@/hooks/useSearchParams"

type PropsType = {
    children: ReactNode,
    id: TABS
}

const Tab = ({ children, id }: PropsType) => {
    const searchParams = useSearchParams()

    const tab = searchParams.get("tab", TABS.SCHEDULER)

    const isSelected = id === tab;

    const clickHandler = () => searchParams.setSearchParam("tab", id)

    return  (
        <li className="w-1/2">
            <button 
                className={classNames(`block py-3 px-5 me-2 text-sm font-medium focus:outline-none bg-white rounded-none 
                    border-0 border-t-0  hover:border-b-black  focus:z-10 focus:ring-4 focus:ring-gray-100 w-full`,
                    isSelected ? "border-b-black !border-b-4 font-bold text-black" : "!border-b border-b-gray-200 text-gray-400")}
                onClick={clickHandler}>
                { children }
            </button>
        </li>
    )
}


export default Tab