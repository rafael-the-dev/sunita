import { useCallback, useEffect, useMemo, useState} from "react"
import Drawer from "@mui/material/Drawer";
import { DrawerProps } from "@mui/material/Drawer/Drawer"

type Props = DrawerProps & {
    onCloseRef: React.MutableRefObject<() => void>,
    onCloseHelper?: () => void,
    onOpen: React.MutableRefObject<() => void>
}

const Container = ({ anchor = "right", children, classes, id, onOpen, onCloseRef, onCloseHelper, ...rest }: Props) => {
    const [ open, setOpen ] = useState(false);

    const childrenMemo = useMemo(() => children, [ children ]);

    const openHandler = useCallback(() => setOpen(true), []);
    const closeHandler = useCallback(
        () => {
            setOpen(false);
            onCloseHelper && onCloseHelper();
        }, 
        [ onCloseHelper ]
    );

    useEffect(() => {
        if(onCloseRef) onCloseRef.current = closeHandler;
    }, [ onCloseRef, closeHandler ])

    useEffect(() => {
        if(onOpen) onOpen.current = openHandler;
    }, [ onOpen, openHandler ]);

    return (
        <Drawer
            { ...rest }
            anchor={ anchor }
            id={id}
            open={open}
            onClose={closeHandler}
            classes={classes}>
            { childrenMemo }
        </Drawer>
    );
};

export default Container;