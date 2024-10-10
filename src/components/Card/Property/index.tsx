
import { Swiper, SwiperSlide } from "swiper/react"
import Typography from "@mui/material/Typography"

import styles from "./styles.module.css"

import {LANGUAGE} from "@/types/language"
import { PropertyType } from "@/types/property"

import useLanguage from "@/hooks/useLanguage"

import Button from "@/components/shared/button"
import Image from "@/components/Image"
import Link from "@/components/link"

const PropertyCard = ({ property }: { property: PropertyType }) => {
    const { translate } = useLanguage()

    return (
        <div>
            <Swiper>
                {
                    property
                        .images
                        .map((image, index) => (
                            <SwiperSlide key={index}>
                                <Image 
                                    alt={`${image} image ${index}`}
                                    className={styles.imageContainer}
                                    loader
                                    src={image}
                                />
                            </SwiperSlide>
                        ))
                }
            </Swiper>
            <div className="px-2 py-3">
                <Typography
                    className="font-semibold ">
                    { property.name }
                </Typography>
                <Typography
                    className="capitalize flex flex-col"
                    component="p">
                        <span className="font-medium mr-2 opacity-90">
                            { translate({ [LANGUAGE.PORTUGUESE]: "Comodidades", [LANGUAGE.ENGLISH]: "Amenities" }) }:
                        </span>
                    {
                        property
                            .amenities
                            .join(", ")
                    }
                </Typography>
                <div className="flex items-end justify-between">
                    <Link 
                        className="block mt-4 no-underline"
                        href={`/search/properties/${property.id}`}>
                        <Button
                            className="block py-2">
                            { translate({ [LANGUAGE.PORTUGUESE]: "Ver detalhes", [LANGUAGE.ENGLISH]: "View details" }) }
                        </Button>
                    </Link>
                    <Typography
                        className=""
                        component="p">
                        { property.price.hourly }/h
                    </Typography>
                </div>
            </div>
        </div>
    )
}

export default PropertyCard