import { ReactNode, useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

type CollapseProps = { 
    children: ReactNode, 
    classes?: { root?: string }; 
    open?: boolean, 
    title: string 
};

const Container = ({ children, classes, open, title }: CollapseProps) => {
    const [ state, setState ] = useState(Boolean(open));

    const childrenMemo = useMemo(() => children, [ children ])

    const clickHandler = useCallback(() => setState(state => !state), []);

    return (
        <div className={classNames(classes?.root)}>
            <Button 
                className="capitalize font-semibold justify-between text-primary-800 shadow-none w-full hover-secondary-button"
                endIcon={ state ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon /> }
                onClick={clickHandler}>
                { title }
            </Button>
            <Collapse unmountOnExit in={state}>
                <div className="px-4 py-3">
                    { childrenMemo }
                </div>
            </Collapse>
        </div>
    );
};

export default Container;