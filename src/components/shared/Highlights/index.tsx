import { ReactNode, useCallback, useEffect, useRef } from "react"
import classNames from "classnames"
import IconButton from "@mui/material/IconButton"

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import styles from "./styles.module.css"

const Container = ({ children, className }: { children: ReactNode, className?: string }) => {

    const index = useRef(0);
    const childrenList = useRef<HTMLElement[]>([]);

    const nextSlideButton = useRef<HTMLButtonElement | null>(null);
    const previousSlideButton = useRef<HTMLButtonElement | null>(null);
    const slider = useRef<HTMLUListElement | null>(null);
    const sliderContainer = useRef<HTMLDivElement | null>(null);

    const getWidth = useCallback(() => {
        const { innerWidth } = window;
        const parentWidth = sliderContainer.current.getBoundingClientRect().width;
        let width = parentWidth;

        if(innerWidth >= 650) {
            width = parentWidth / 3
        } 
        else if(innerWidth >= 500) {
            width = parentWidth / 2;
        }

        return width
    }, [])

    const slideTo = useCallback((increment: number) => () => {
        const newIndex = index.current + increment;
       
        if((newIndex < 0) || (newIndex >= childrenList.current.length)) return;
        
        index.current = newIndex;

        const width = getWidth();

        slider.current.style.transform = `translateX(calc(${-width * index.current}px - 0.75rem))`;
    }, [ getWidth ])

    const layout = useCallback(() => {
        if(window.innerWidth >= 1024) return;

        let width = getWidth();
        
        childrenList.current.forEach((child, index) => {
            child.style.left = `calc(${width * index}px + 0.75rem)`;
            child.style.width = `calc(${width}px - 1.5rem)`;
        })

        slider.current.style.width = `${width * childrenList.current.length}px`;

        slideTo(index.current)
    }, [ getWidth, slideTo ])

    useEffect(() => {
        childrenList.current = Array.from(slider.current.children) as HTMLElement[];

        const currentWindow = window;

        layout();

        currentWindow.addEventListener("resize", layout);

        return () => {
            currentWindow.removeEventListener("resize", layout);
        }
    }, [ layout ])

    return (
        <div className={className}>
            <div 
                className={classNames(styles.primaryBgContainer, `bg-primary-600 relative`)}>
                <div className={classNames(styles.sliderContainer, "absolute box-border overflow-x-hidden py-4 px-3")} ref={sliderContainer} >
                    <ul 
                        className={classNames(styles.slider, `flex h-full justify-between relative`)}
                        ref={slider}>
                       { children }
                    </ul>
                </div>
                <div className={classNames(styles.buttonsContainer, `absolute flex justify-between left-0 w-full xl:hidden`)}>
                    <IconButton 
                        className="opacity-70 hover:bg-primary-700 hover:text-white"
                        onClick={slideTo(-1)}
                        ref={previousSlideButton}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <IconButton 
                        className="opacity-70 hover:bg-primary-700 hover:text-white"
                        onClick={slideTo(1)}
                        ref={nextSlideButton}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default Container