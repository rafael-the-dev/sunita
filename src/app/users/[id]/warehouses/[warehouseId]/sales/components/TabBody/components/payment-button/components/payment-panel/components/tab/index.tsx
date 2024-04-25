import * as React from "react";
import Button from "@mui/material/Button";
import classNames from "classnames";


type ButtonProps = {
    children: React.ReactNode;
    changeTab: (value: string) => void;
    id: string;
    tab: string;
}


const Tab = ({ children, changeTab, id, tab }: ButtonProps) => {
    const isSelected = id === tab;

    const clickHandler = () => changeTab(id);

    return (
        <li className="w-1/2">
            <Button
                className={classNames(
                    `rounded-none w-full`,
                    isSelected ? "bg-primary-700 text-white" : "bg-primary-200 text-white"
                )}
                onClick={clickHandler}>
                { children }
            </Button>
        </li>
    );
};

export default Tab;