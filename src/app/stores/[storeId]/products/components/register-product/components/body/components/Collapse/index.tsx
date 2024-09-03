import { ReactNode } from "react"

import Collapse from "@/components/shared/collapse"

const CollapseContainer = ({ children, title }: { children: ReactNode, title: string }) => {

    return (
        <Collapse
            classes={{ root: "border border-primary-300 border-solid flex flex-col gap-y-4 rounded-md" }}
            
            open
            title={title}>
            { children }
        </Collapse>
    )
}

export default CollapseContainer