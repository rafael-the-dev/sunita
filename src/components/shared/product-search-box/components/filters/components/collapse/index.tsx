import { ReactNode, useCallback, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Container = ({ children, open, title }: { children: ReactNode, open?: boolean, title: string }) => {
    const [ state, setState ] = useState(Boolean(open));

    const childrenMemo = useMemo(() => children, [ children ])

    const clickHandler = useCallback(() => setState(state => !state), []);

    return (
        <div>
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