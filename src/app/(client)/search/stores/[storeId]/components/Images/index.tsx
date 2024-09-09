import classNames from "classnames"
import { Swiper as Carousel, SwiperSlide } from "swiper/react"

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

    const breakpoints = {
        600: {
            spaceBetween: 20,
            slidesPerView: 2
        },
        768: {
            spaceBetween: 20,
            slidesPerView: 3
        },
        1024: {
            spaceBetween: 20,
            slidesPerView: 4
        }
    }

    return (
        <div className={classNames(styles.sliderContainer, "mt-4 slider-container")}>
            <div className="xl:hidden">
                <Carousel breakpoints={breakpoints}>
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
            <div className={classNames(styles.imagesWrapper, "hidden xl:grid")}>
                {
                    imagesList
                        .map((image, index) => (
                            <Image
                                alt={`${alt} ${index}`}
                                key={index}
                                loader
                                src={image} 
                            />
                        ))
                }
            </div>
        </div>
    )
}

export default ImageContainaer