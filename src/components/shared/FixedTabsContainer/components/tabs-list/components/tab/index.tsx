import { useContext } from "react";
import Button from "@mui/material/Button";
import classNames from "classnames"

import { FixedTabsContext } from "@/context/FixedTabsContext";

type TabProps = {
    id: string;
    label: string;
}

const TabContainer = ({ id, label }: TabProps) => {
    const { getActiveTab, setTab } = useContext(FixedTabsContext)
    
    const isSelected = getActiveTab().id === id;

    const clickHandler = () => setTab(id);

    return (
        <li>
            <Button 
                className={classNames(
                    "rounded-t-none text-black text-small",
                    { "bg-primary-100": isSelected }
                )}
                onClick={clickHandler}>
                { label }
            </Button>
               
        </li>
    )
}

export default TabContainer