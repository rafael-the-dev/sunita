import { ReactNode } from "react"
import classNames from "classnames"

import styles from "./styles.module.css"

const Container = ({ children, className }: { children: ReactNode, className?: string }) => {
    return (
        <div 
            className={classNames(styles.container, className, `gap-x-12 items-stretch px-[5%] 
                pt-8 pb-8 xl:flex`)}>
            { children }
        </div>
    )
}


export default Container