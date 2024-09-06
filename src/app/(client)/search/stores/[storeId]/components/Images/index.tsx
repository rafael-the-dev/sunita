import classNames from "classnames"
import Carousel from "react-slick"

import styles from "./styles.module.css"

import Image from "@/components/Image"

const ImageContainaer = ({ alt, src }: { src: string[], alt: string }) => {
    const imagesList = src ?? []

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 6000,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
      };

    return (
        <div className={classNames(styles.sliderContainer, "mt-4 slider-container")}>
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