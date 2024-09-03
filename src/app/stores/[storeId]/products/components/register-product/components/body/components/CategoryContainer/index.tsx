import { ReactNode } from "react"
import classNames from "classnames"
import Title from "../Title"

type PropsType = {
    children: ReactNode,
    className?: string,
    title: string
}

const FieldsetContainer = ({ children, className, title }: PropsType) => {
    return (
        <fieldset className={classNames(className, "flex flex-col items-stretch mt-6")}>
            <Title className="mb-4">
                { title }
            </Title>
            { children }
        </fieldset>
    )
}

export default FieldsetContainer
