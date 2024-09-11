
import classNames from "classnames"
import { Swiper, SwiperSlide } from "swiper/react"
import Typography from "@mui/material/Typography"

import styles from "./styles.module.css"

import Button from "@/components/shared/button"
import Link from "@/components/link"

const list = [
    {
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLKrP_eBRLQQqYIkHwdlyqsaZext_SvcPDtQ&s"
    },
    {
        image: "https://images.pexels.com/photos/4992830/pexels-photo-4992830.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    /*{
        image: ""
    },
    {
        image: ""
    },
    {
        image: ""
    },*/
]

const Hero = () => {
    const gradient = "linear-gradient(to bottom, rgba(0, 0, 0, .2), rgba(0, 0, 0, .4))"

    return (
        <section className="relative">
            <Swiper>
                {
                    list.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div 
                                className={classNames(styles.imageContainer, `bg-cover bg-center bg-no-repeat `)}
                                style={{ backgroundImage: `${gradient}, url(${item.image})`}}>

                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            <div className={classNames(styles.content, "flex flex-col pt-6 px-[5%] sm:absolute sm:text-white sm:z-10")}>
                <Typography
                    component="h1"
                    className="font-bold text-2xl md:text-3xl lg:text-4xl">
                    Find the Perfect Place—Right Near You!
                </Typography>
                <Typography
                    component="p"
                    className="mt-3 opacity-90">
                    Browse apartments, houses, and workspaces near your location and book instantly with just a few clicks.
                </Typography>
                <Link 
                    className="mt-6 no-underline"
                    href="/search/stores">
                    <Button>
                        Search Nearby Properties
                    </Button>
                </Link>
            </div>
        </section>
    )
}

export default Hero