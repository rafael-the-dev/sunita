import { useContext } from "react";
import IconButton from "@mui/material/IconButton";

import More from "@mui/icons-material/Add";

import { TabsContext } from "@/context/TabsContext";

const TabContainer = () => {
    const { addTab, getTabsList } = useContext(TabsContext)

    if(getTabsList().length === 5) return <></>

    return (
        <li>
            <IconButton onClick={addTab}>
                <More />
            </IconButton>
        </li>
    )
}

export default TabContainer