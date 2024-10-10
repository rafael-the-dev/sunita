
import classNames from "classnames"
import { Autoplay } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import Typography from "@mui/material/Typography"

import styles from "./styles.module.css"

import { LANGUAGE } from "@/types/language"

import useLanguage from "@/hooks/useLanguage"

import Button from "@/components/shared/button"
import Link from "@/components/link"

const list = [
    {
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLKrP_eBRLQQqYIkHwdlyqsaZext_SvcPDtQ&s"
    },
    {
        image: "https://images.pexels.com/photos/4992830/pexels-photo-4992830.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
        image: "data:image/jpeg;base64,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"
    },
    /*{
        image: ""
    },
    {
        image: ""
    },*/
]

const Hero = () => {
    const { translate } = useLanguage()

    const gradient = "linear-gradient(to bottom, rgba(0, 0, 0, .2), rgba(0, 0, 0, .4))"

    return (
        <section className="relative">
            <Swiper 
                autoplay
                modules={[ Autoplay ]}>
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
                    { 
                        translate(
                            { 
                                [LANGUAGE.PORTUGUESE]: "Encontre o lugar perfeito – bem perto de você!", 
                                [LANGUAGE.ENGLISH]: "Find the Perfect Place—Right Near You!" 
                            }
                        ) 
                    }
                </Typography>
                <Typography
                    component="p"
                    className="mt-3 opacity-90">
                    { 
                        translate(
                            { 
                                [LANGUAGE.PORTUGUESE]: "Procure apartamentos, casas e espaços de trabalho próximos à sua localização e reserve  instantaneamente com apenas alguns cliques.", 
                                [LANGUAGE.ENGLISH]: "Browse apartments, houses, and workspaces near your location and book instantly with just  a few clicks." 
                            }
                        ) 
                    }
                    
                </Typography>
                <Link 
                    className="mt-6 no-underline"
                    href="/search/properties">
                    <Button>
                        { 
                            translate(
                                { 
                                    [LANGUAGE.PORTUGUESE]: "Pesquisar propriedades próximas", 
                                    [LANGUAGE.ENGLISH]: "Search Nearby Properties" 
                                }
                            ) 
                        }
                    </Button>
                </Link>
            </div>
        </section>
    )
}

export default Hero