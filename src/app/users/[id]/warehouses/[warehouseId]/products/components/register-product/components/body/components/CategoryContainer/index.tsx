import { ReactNode } from "react"
import Title from "../Title"

type PropsType = {
    children: ReactNode,
    title: string
}

const CategoryContainer = ({ children, title }: PropsType) => {
    return (
        <fieldset>
            <Title>
                { title }
            </Title>
            { children }
        </fieldset>
    )
}

export default CategoryContainer
