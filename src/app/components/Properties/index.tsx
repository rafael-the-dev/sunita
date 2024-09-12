import classNames from "classnames"
import { Swiper, SwiperSlide } from "swiper/react"
import Typography from "@mui/material/Typography"

import styles from "./styles.module.css"

import { PROPERTY_TYPE } from "@/types/property"

import Link from "@/components/link"
import Title from "@/app/(client)/search/stores/[storeId]/components/Title"

const list = [
    {
        image: "https://images.pexels.com/photos/3201763/pexels-photo-3201763.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Bedroom",
        type: PROPERTY_TYPE.BED_ROOM
    },
    {
        image: "https://images.pexels.com/photos/16660116/pexels-photo-16660116/free-photo-of-wedding-day-preparation.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Wedding place",
        type: PROPERTY_TYPE.OFICE
    },
    {
        image: "https://images.pexels.com/photos/2988860/pexels-photo-2988860.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "House",
        type: PROPERTY_TYPE.HOUSE
    },
    {
        image: "https://images.pexels.com/photos/699459/pexels-photo-699459.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Work place",
        type: PROPERTY_TYPE.OFICE
    }
]

const backgroundGradient = `linear-gradient(to bottom, rgba(0, 0, 0, .1), rgba(0, 0, 0, .5))`

const ListItem = ({ image, title, type }: typeof list[0]) => (
    <>
        <Link
            className="block box-border no-underline w-full h-full"
            href={`/search/stores?property=${type}`}>
            <div 
                style={{ backgroundImage: `${backgroundGradient}, url(${image})`}}
                className={classNames(styles.listItemContent, `box-border bg-center bg-cover bg-no-repeat flex items-end px-2 py-3 w-full`)}>
                <Typography
                    component="h3"
                    className="text-white">
                    { title }
                </Typography>
            </div>
        </Link>
    </>
)

const DiscoverProperties  = () => {
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
            <Title className="mb-6">
                Discover your new favorite stay
            </Title>
            <div>
                <Swiper breakpoints={breakpoints}>
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
                </Swiper>
            </div>
        </section>
    )
}

export default DiscoverProperties