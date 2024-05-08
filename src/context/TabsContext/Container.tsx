import { ReactNode, useContext } from "react";

import { TabsContext } from "./index"

type PropsType = {
    children: ReactNode;
    id: string;
}

const Container = ({ children, id }: PropsType) => {
    const { getActiveTab } = useContext(TabsContext);

    return (
        <div className={ getActiveTab().id !== id ? "hidden" : ""}>
            { children }
        </div>
    )
};

export default Container;