import { useContext } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import classNames from "classnames"

import CloseIcon from "@mui/icons-material/Close"

import { FixedTabsContext } from "@/context/FixedTabsContext";

type TabProps = {
    id: string;
    label: string;
}

const TabContainer = ({ id, label }: TabProps) => {
    const { getActiveTab, getTabsList, setTab } = useContext(FixedTabsContext)
    
    const isSelected = getActiveTab().id === id;

    const clickHandler = () => setTab(id);

    return (
        <li>
            <Button 
                className={classNames(
                    "rounded-t-none text-black",
                    { "bg-primary-700 text-white": isSelected }
                )}
                onClick={clickHandler}>
                { label }
            </Button>
               
        </li>
    )
}

export default TabContainer