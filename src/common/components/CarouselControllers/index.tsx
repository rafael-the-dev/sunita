import { useState } from "react"
import classNames from "classnames"
import { useSwiper } from "swiper/react"
import IconButton from "@mui/material/IconButton"

import ArrowBackIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

const Controllers = ({ className }: { className?: string }) => {
    const [ hasReached, setHasReached ] = useState({ beginning: false, end: false })

    const swiper = useSwiper()

    const goToNextSlide = () => swiper.slideNext()
    const goToPreviousSlide = () => swiper.slidePrev()

    swiper.on("slideChange", (swiper) => setHasReached({ beginning: swiper.isBeginning, end: swiper.isEnd }))
    swiper.on("resize", (swiper) => setHasReached({ beginning: swiper.isBeginning, end: swiper.isEnd }))
    swiper.on("init", (swiper) => setHasReached({ beginning: swiper.isBeginning, end: swiper.isEnd }))
    //swiper.on("reachBeginning", () => setHasReached({ beginning: true, end: false }))
    //swiper.on("reachEnd", () => setHasReached({ beginning: false, end: true }))

    if(hasReached.beginning && hasReached.end) return <div className="mt-4"></div>;

    return (
        <div className={classNames(className, "flex items-center justify-between w-full")}>
            <IconButton 
                disabled={hasReached.beginning}
                onClick={goToPreviousSlide}>
                <ArrowBackIcon />
            </IconButton>
            <IconButton 
                disabled={hasReached.end}
                onClick={goToNextSlide}>
                <ArrowForwardIcon />
            </IconButton>
        </div>
    )
}

export default Controllers