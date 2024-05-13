import { ReactNode } from "react"
import Button from "@mui/material/Button";
import classNames from "classnames";

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MouseEventFunc } from "@/types/events";

type PropsType = {
    children: ReactNode;
    id: string;
    onClick: (id: string) => MouseEventFunc<HTMLButtonElement>;
    selectedKey: string;
}

const ButtonContainer = ({ children, id, onClick, selectedKey }: PropsType) => {
    const selected = id === selectedKey;

    return (
        <Button 
            className={classNames("mr-2", selected ? "bg-primary-400 rounded-xl text-white" : "text-black" )}
            endIcon={selected ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={onClick(id)}>
            { children }
        </Button>
    );
};

export default ButtonContainer;