import * as React from "react";
import classNames from 'classnames';

import styles from "./styles.module.css";

type PropsType = {
    children: React.ReactNode,
    classes?: {
        root?:string
    },
    helper?: (element: React.MutableRefObject<HTMLDivElement>) => void,
    minHeight?: number,
    minWidth?: number,
    onResize?: (element: React.MutableRefObject<HTMLDivElement>) => void
}

const Container = ({ children, classes, helper, minHeight, minWidth, onResize }: PropsType ) => {
    let startX: number, startY: number, startWidth: number, startHeight: number;
    const paperRef = React.useRef<HTMLDivElement>(null);

    const initDrag = (e) => {
        startX = e.clientX;
        startY = e.clientY;
        // startWidth = parseInt(document.defaultView.getComputedStyle(paperRef.current).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(paperRef.current).height, 10);
        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
    };

    const doDrag = (e) => {
        paperRef.current.style.width = (startWidth + e.clientX - startX) + 'px';
        paperRef.current.style.height = (startHeight + e.clientY - startY) + 'px';
    }
     
    const stopDrag = (e) => {
        document.documentElement.removeEventListener('mousemove', doDrag, false);    
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
    }

    React.useEffect(() => {
        const { height } = (paperRef.current.firstChild as Element).getBoundingClientRect();
        paperRef.current.style.height = `${height}px`;Node

        helper && helper(paperRef);
    }, [ helper ]);

    const resizeHandler = React.useCallback(() => onResize(paperRef), [ onResize ])

    React.useEffect(() => {
        if(!onResize) return;

        const currentWindow = window;

        currentWindow.addEventListener('resize', resizeHandler);

        return () => {
            currentWindow.addEventListener('resize', resizeHandler);   
        };
    }, [ onResize, resizeHandler ])

    return (
        <div 
            className={classNames(classes?.root, `w-fit min-h-fit max-w-full relative`)}
            ref={paperRef}
            style={{ minHeight, minWidth }}>
            { children }
            <div 
                className={classNames(styles.resizer)}
                onMouseDown={initDrag}></div>
        </div>
    );
};

export default Container;