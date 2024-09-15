import classNames from "classnames"
import IconButton from "@mui/material/IconButton"
import { Swiper as Carousel, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import styles from "./styles.module.css"

import Image from "@/components/Image"

const CustomButton = (props) => (
    <IconButton
        { ...props}>
        <ArrowForwardIosIcon />
    </IconButton>
)


const ImageContainaer = ({ alt, src }: { src: string[], alt: string }) => {
    const imagesList = src ?? []

    if(imagesList.length === 0) return (
        <Image 
            alt={alt}
            className={styles.imageContainer}
            loader
            src=""
        />
    )

    return (
        <div className={classNames(styles.sliderContainer, "public-properties-card slider-container")}>
            <Carousel 
                autoplay
                modules={[ Autoplay ]}>
                {
                    imagesList.map((image, index) => (
                        <SwiperSlide key={index}>
                            <Image 
                                alt={`${alt} ${index}`}
                                className={styles.imageContainer}
                                loader
                                src={image}
                            />
                        </SwiperSlide>
                    ))
                }
            </Carousel>
        </div>
    )
}

export default ImageContainaer