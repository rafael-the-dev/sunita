import classNames from "classnames"
import IconButton from "@mui/material/IconButton"
import Carousel from "react-slick"

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

    const settings = {
        autoPlay: true,
        autoplaySpeed: 500,
        cssEase: "linear",
        dots: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className={classNames(styles.sliderContainer, "public-properties-card slider-container")}>
            <Carousel { ...settings }>
                {
                    imagesList.map((image, index) => (
                        <Image 
                            alt={`${alt} ${index}`}
                            className={styles.imageContainer}
                            key={index}
                            loader
                            src={image}
                        />
                    ))
                }
            </Carousel>
        </div>
    )
}

export default ImageContainaer