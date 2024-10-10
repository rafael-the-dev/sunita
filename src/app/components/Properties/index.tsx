import classNames from "classnames"
import { Swiper, SwiperSlide } from "swiper/react"
import Typography from "@mui/material/Typography"

import styles from "./styles.module.css"

import { LANGUAGE } from "@/types/language"
import { PROPERTY_TYPE } from "@/types/property"

import useLanguage from "@/hooks/useLanguage"

import Controllers from "@/common/components/CarouselControllers"
import Link from "@/components/link"
import Title from "@/app/(client)/search/properties/[propertyId]/components/Title"

const list = [
    {
        image: "https://images.pexels.com/photos/3201763/pexels-photo-3201763.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: {
            [LANGUAGE.ENGLISH]: "Guest house | Bedroom",
            [LANGUAGE.PORTUGUESE]: "Guest house | Quarto"
        },
        type: PROPERTY_TYPE.BED_ROOM
    },
    {
        image: "https://images.pexels.com/photos/16660116/pexels-photo-16660116/free-photo-of-wedding-day-preparation.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: {
            [LANGUAGE.ENGLISH]: "Wedding place",
            [LANGUAGE.PORTUGUESE]: "Local de casamento"
        },
        type: PROPERTY_TYPE.OFICE
    },
    {
        image: "https://images.pexels.com/photos/2988860/pexels-photo-2988860.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: {
            [LANGUAGE.ENGLISH]: "House",
            [LANGUAGE.PORTUGUESE]: "Casa"
        },
        type: PROPERTY_TYPE.HOUSE
    },
    {
        image: "https://images.pexels.com/photos/699459/pexels-photo-699459.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: {
            [LANGUAGE.ENGLISH]: "Office",
            [LANGUAGE.PORTUGUESE]: "Escritório"
        },
        type: PROPERTY_TYPE.OFICE
    }
]

const backgroundGradient = `linear-gradient(to bottom, rgba(0, 0, 0, .1), rgba(0, 0, 0, .5))`

const ListItem = ({ image, title, type }: typeof list[0]) => {
    const { language } = useLanguage()

    return (
        <>
            <Link
                className="block box-border no-underline w-full h-full"
                href={`/search/properties?type=${type}`}>
                <div 
                    style={{ backgroundImage: `${backgroundGradient}, url(${image})`}}
                    className={classNames(styles.listItemContent, `box-border bg-center bg-cover bg-no-repeat flex items-end px-2 py-3 w-full`)}>
                    <Typography
                        component="h3"
                        className="text-white">
                        { title[language] }
                    </Typography>
                </div>
            </Link>
        </>
    )
}

const DiscoverProperties  = () => {
    const { translate } = useLanguage()

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
        <section className="mt-12 px-[5%]">
            <Title className="mb-2">
                { 
                    translate(
                        { 
                            [LANGUAGE.PORTUGUESE]: "Descubra a sua nova estadia favorita", 
                            [LANGUAGE.ENGLISH]: "Discover your new favorite stay" 
                        }
                    ) 
                }
            </Title>
            <div className="">
                <Swiper 
                    breakpoints={breakpoints} 
                    className="flex flex-col-reverse">
                    {
                        list.map(
                            (item, index) => (
                                <SwiperSlide key={index}>
                                    <ListItem 
                                        { ...item }
                                        key={index}
                                    />
                                </SwiperSlide>
                            )
                        )
                    }
                    <Controllers className="mb-4" />
                </Swiper>
            </div>
        </section>
    )
}

export default DiscoverProperties