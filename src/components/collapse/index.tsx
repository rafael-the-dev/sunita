import * as React from "react";
import Collapse from "@mui/material/Collapse";

type CollapsePropsType = {
    children: React.ReactNode,
    onClose: React.MutableRefObject<() => void>;
    onOpen: React.MutableRefObject<() => void>;
    onToggle: React.MutableRefObject<() => void>
};

const CollapseContainer = ({ children, onClose, onOpen, onToggle, ...rest }: CollapsePropsType) => {
    const [ open, setOpen ] = React.useState(false);

    const childrenMemo = React.useMemo(() => children, [ children ]);

    React.useEffect(() => {
        if(Boolean(onClose)) onClose.current = () => setOpen(false);
        if(Boolean(onOpen)) onOpen.current = () => setOpen(true);
        if(Boolean(onToggle)) onToggle.current = () => setOpen(b => !b);
    }, [ onClose, onOpen, onToggle ]);

    return (
        <Collapse unmountOnExit in={open} { ...rest }>
            { childrenMemo }
        </Collapse>
    )
};

export default CollapseContainer;