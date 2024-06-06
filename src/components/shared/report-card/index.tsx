import classNames from "classnames"
import { ReactNode } from "react"

import styles from "./styles.module.css"

import Description from "./components/description"
import Title from "./components/title"

type PropsTypes = {
    className?: string,
    children: ReactNode
}

const ReportCard = ({ className, children }: PropsTypes) => {

    return (
        <div className={classNames(styles.card, className, `bg-primary-700 mb-4 text-white px-3 py-4 md:flex flex-col
            justify-around md:mb-0 md:pl-8`)}>
            { children }
        </div>
    )
}

ReportCard.Description = Description
ReportCard.Title = Title

export default ReportCard