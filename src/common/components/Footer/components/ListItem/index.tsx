import { ReactNode } from "react"
import classNames from "classnames"
import { usePathname } from "next/navigation"

import Link from "@/components/link"

type PropsType = {
    children: ReactNode,
    href: string
}

const ListItem = ({ children, href }: PropsType) =>{
    const pathname = usePathname();

    const isCurrentPathname = pathname === href;

    return  (
        <li className="">
            <Link
                className={classNames("no-underline py-1 text-white", { "font-bold !text-gray-500": isCurrentPathname})}
                href={href}>
                { children }
            </Link>
        </li>
    )
}

export default ListItem