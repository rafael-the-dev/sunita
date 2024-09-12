import { ReactNode } from "react"
import { usePathname } from "next/navigation"

import Link from "@/components/link"

const links = [
    {
        href: "/",
        label: "Home"
    },
    {
        href: "/",
        label: "About us"
    },
    {
        href: "/",
        label: "Pricing"
    }
]

const ListItem = ({ children, href }: { children: ReactNode, href: string }) => {

    return (
        <li>
            <Link 
                className={`border-b border-solid border-primary-50 flex items-center justify-center no-underline opacity-90 
                    py-2 text-white w-full md:opacity-95 md:py-0 md:text-black hover:text-gray-600`}
                href={href}>
                { children }
            </Link>
        </li>
    )
}

const List = () => {

    return (
        <ul className="flex flex-col items-stretch md:flex-row md:gap-x-4 lg:gap-x-8">
            {
                links.map((item, index) => (
                    <ListItem 
                        { ...item }
                        key={index}>
                        { item.label }
                    </ListItem>
                ))
            }
        </ul>
    )
}

export default List