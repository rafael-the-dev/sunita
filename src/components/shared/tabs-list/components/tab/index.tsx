import { useContext } from "react";
import Button from "@mui/material/Button";
import classNames from "classnames"

import { TabsContext } from "@/context/TabsContext";

type TabProps = {
    id: string;
    label: string;
}

const TabContainer = ({ id, label }: TabProps) => {
    const { activateTab, getActiveTab } = useContext(TabsContext)

    const isSelected = getActiveTab().id === id;

    const clickHandler = () => {
        if(isSelected) return

        activateTab(id)
    }

    return (
        <li>
            <Button 
                className={classNames(
                    "rounded-t-none text-black",
                    { "bg-primary-100 rounded-bl-2xl": isSelected })}
                onClick={clickHandler}>
                { label }
            </Button>
        </li>
    )
}

export default TabContainer