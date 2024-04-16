import * as React from "react";
import Popover from "@mui/material/Popover";
import { PopoverClasses } from "@mui/material/Popover"
import { usePathname } from "next/navigation";

type ClickHandler = React.MutableRefObject<(e: React.MouseEvent<HTMLButtonElement>) => void>;

type Props = {
    children: React.ReactNode;
    classes?: PopoverClasses;
    customClose?: () => void;
    id: string;
    onClickRef: ClickHandler;
    onCloseRef?: ClickHandler;
}

const PopoverContainer = ({ children, classes, customClose, id, onClickRef, onCloseRef }: Props ) => {
    const pathname = usePathname();

    const [ anchorEl, setAnchorEl] = React.useState(null);
    const currentPath = React.useRef(null);
    
    const openPopover = Boolean(anchorEl);
    const popoverID = openPopover ? `${id}-popover` : undefined;
    
    const childrenMemo = React.useMemo(() => <>{ children }</>, [ children ])

    const handleClose = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        event && event.stopPropagation();
        setAnchorEl(null);
    }, []);

    const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    React.useEffect(() => {
        onClickRef.current = handleClick;
    }, [ handleClick, onClickRef ]);

    React.useEffect(() => {
        if(onCloseRef)
            onCloseRef.current = handleClose;
    }, [ handleClose, onCloseRef ]);

    React.useEffect(() => {
        if(pathname !== currentPath.current) {
            setAnchorEl(null);
            return;
        }
        currentPath.current = pathname;
    }, [ pathname ]);

    return (
        <Popover
            id={popoverID}
            open={openPopover}
            anchorEl={anchorEl}
            onClose={customClose ? customClose : handleClose}
            classes={ classes }
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            { childrenMemo }
        </Popover>
    );
};

export default PopoverContainer;