import { ReactNode } from "react"
import classNames from "classnames"
import { usePathname } from "next/navigation"

type PropsType = {
    children: ReactNode,
    href: string
}

const SocialMedia = ({ children, href }: PropsType) =>{
    const pathname = usePathname();

    const isCurrentPathname = pathname === href;

    return  (
        <li className="">
            <a
                className={classNames("no-underline py-1 text-white", { "font-bold": isCurrentPathname})}
                href={href}
                target="_blank">
                { children }
            </a>
        </li>
    )
}

export default SocialMedia