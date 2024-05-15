import { useCallback, useContext, useEffect, useRef } from "react";
import classNames from "classnames";
import Button from "@mui/material/Button"
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import styles from "./styles.module.css";
import { AnalyticsContext } from "@/context/AnalyticsContext";
import { AnalyticsFiltersContext } from "@/context/AnalyticsFilters";

import Card from "./components/card"

const Highlights = () => {
    const { getAnalytics } = useContext(AnalyticsContext)
    const { onToggleCollapse } = useContext(AnalyticsFiltersContext)

    const listRef = useRef<HTMLUListElement | null>(null)
    const sliderRef = useRef<HTMLUListElement | null>(null)
    const childrenList = useRef<HTMLElement[]>([])
    const currentIndex = useRef(0)
    const slideWidth = useRef(0)

    const toggleHandler = useCallback(() => onToggleCollapse.current?.(), [ onToggleCollapse ])

    const nextSlide = useCallback(() => {
        const nextSlideIndex = currentIndex.current + 1;
        if(nextSlideIndex >= childrenList.current.length) return;

        currentIndex.current = nextSlideIndex;
        sliderRef.current.style.transform = `translate(${-nextSlideIndex * slideWidth.current}px, 0)`
    }, [])

    const previousSlide = useCallback(() => {
        const previousSlideIndex = currentIndex.current - 1;
        if(previousSlideIndex < 0) return;

        currentIndex.current = previousSlideIndex;
        sliderRef.current.style.transform = `translate(${-previousSlideIndex * slideWidth.current}px, 0)`
    }, [])


    const layout = useCallback(() => {
        const { innerWidth } = window;
        const parentWidth = sliderRef.current.parentElement.clientWidth;

        let width = innerWidth / 1 - 35;
        let maxHeight = 0;
        
        childrenList.current.forEach((child, index) => {
            const { height } = child.getBoundingClientRect();
            if(height > maxHeight) maxHeight = height;
            
            child.style.width = `${width}px`;
            child.classList.add("h-full");
            child.style.left = `${(width - (0)) * index}px`;
        });
        
        slideWidth.current = width
        sliderRef.current.style.width = `${width * childrenList.current.length}px`;
    }, [ ]);

    useEffect(() => {
        const list = Array.from(sliderRef.current.children) as HTMLElement[];
        childrenList.current = list;

        layout();
        // setChildrenListRef.current?.(list);
    }, [ layout ]);

    useEffect(() => {
        const currentWindow = window;

        window.addEventListener("resize", layout);

        return () => {
            currentWindow.removeEventListener("resize", layout);
        }
    }, [ layout ])

    return (
        <div className={classNames(styles.row, "bg-primary-700 mx-3 p-2 rounded-md relative")}>
            <div className={classNames(styles.listWrapper, "h-full overflow-hidden relative md:absolute md:overflow-visible")}>
                <ul 
                    className={classNames(styles.slider, "h-full relative md:flex")}
                    ref={sliderRef}>
                    <Card 
                        color="#f3f4f6"
                        description={getAnalytics()?.sales?.total}
                        title="Sales"
                    />
                    <Card 
                        color="#f3f4f6"
                        description={getAnalytics()?.expenses.total}
                        title="Expenses"
                    />
                    <Card 
                        color="#f3f4f6"
                        description={getAnalytics()?.profit}
                        title="Profit"
                    />
                    <Hidden xlDown>
                        <li className={classNames(styles.filterButtonContainer)}>
                            <Button
                                className={classNames(styles.filtersButton, ` 
                                    h-full rounded-md py-6 text-black w-full hover:bg-stone-400`)}
                                onClick={toggleHandler}
                                startIcon={<FilterAltIcon />}>
                                Filters
                            </Button>
                        </li>
                    </Hidden>
                </ul>
            </div>
            <Hidden mdUp>
                <div className={classNames(styles.controllers, "absolute flex justify-between left-0 top-1/2 w-full z-10 md:hidden")}>
                    <IconButton onClick={previousSlide}>
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <IconButton onClick={nextSlide}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </div>
            </Hidden>
        </div>
    )
}

export default Highlights