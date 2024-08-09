import { ReactNode } from "react"
import Title from "../Title"

type PropsType = {
    children: ReactNode,
    title: string
}

const FieldsetContainer = ({ children, title }: PropsType) => {
    return (
        <fieldset className="flex flex-col items-stretch mt-6">
            <Title className="mb-4">
                { title }
            </Title>
            { children }
        </fieldset>
    )
}

export default FieldsetContainer
