import { useContext } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import classNames from "classnames"

import CloseIcon from "@mui/icons-material/Close"

import { TabsContext } from "@/context/TabsContext";

type TabProps = {
    id: string;
    label: string;
}

const TabContainer = ({ id, label }: TabProps) => {
    const { activateTab, getActiveTab, getTabsList, removeTab } = useContext(TabsContext)

    const isSelected = getActiveTab().id === id;
    const hasOneTab = getTabsList().length === 1; 

    const clickHandler = () => {
        if(isSelected) return;

        activateTab(id);
    };

    const removeHandler = () => removeTab(id);

    return (
        <li>
            { 
                !isSelected && (
                    <Button 
                        className={classNames("rounded-t-none text-black")}
                        onClick={clickHandler}>
                        { label }
                    </Button>
                ) 
            }
            {
                isSelected && (
                    <div className={classNames(`flex items-center`,
                        { "bg-primary-100 pl-2": isSelected },
                        { "p-2": hasOneTab }
                    )}>
                        <Typography
                            component="span"
                            className="text-small">
                            { label }
                        </Typography>
                        {
                            !hasOneTab && (
                                <IconButton
                                    className="ml-4 opacity-80 hover:bg-transparent hover:text-red-600"
                                    onClick={removeHandler}>
                                    <CloseIcon className="text-[.95rem]" />
                                </IconButton>
                            )
                        }
                    </div>
                )
            }
        </li>
    )
}

export default TabContainer