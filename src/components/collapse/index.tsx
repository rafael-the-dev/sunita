import * as React from "react";
import Collapse from "@mui/material/Collapse";
import useSearchParamsHook from "@/hooks/useSearchParams";

type CollapsePropsType = {
    children: React.ReactNode,
    onClose?: React.MutableRefObject<() => void>;
    onOpen?: React.MutableRefObject<() => void>;
    onToggle?: React.MutableRefObject<() => void>;
    showSearchParam?: boolean;
};

const CollapseContainer = ({ children, onClose, onOpen, onToggle, showSearchParam, ...rest }: CollapsePropsType) => {
    const [ open, setOpen ] = React.useState(false);

    const childrenMemo = React.useMemo(() => children, [ children ]);

    const searchParams = useSearchParamsHook();
    React.useEffect(() => {
        if(showSearchParam) {
            searchParams.setSearchParam("collapse", JSON.stringify(open))
        }
    }, [ open, searchParams, showSearchParam ])

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