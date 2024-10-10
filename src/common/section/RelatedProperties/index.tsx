import { useContext } from "react";
import Button from "@mui/material/Button"
import classNames from "classnames"
import { Swiper, SwiperSlide } from 'swiper/react';

import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import {LANGUAGE} from "@/types/language"

import { PropertiesContext } from "@/context/PropertiesContext";

import useLanguage from "@/hooks/useLanguage"

import Card from "@/components/Card/Property"
import Controllers from "@/common/components/CarouselControllers"
import Link from "@/components/link"
import Title from "@/app/(client)/search/properties/[propertyId]/components/Title"

type PropsType = { 
    classes?: {
        root?: string,

    },
    queryParams?: string,
}

const RelatedProperties = ({ classes, queryParams }: PropsType) => {
    const { data, error } = useContext(PropertiesContext)

    const { translate } = useLanguage()

    const properties = data ?? []
 
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
        <section className={classNames(classes?.root)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <Title>
                    { 
                        translate(
                            { 
                                [LANGUAGE.PORTUGUESE]: "Propriedades disponíveis perto de você", 
                                [LANGUAGE.ENGLISH]: "Properties Available Near You" 
                            }
                        ) 
                    }
                </Title>
                <Link
                    className="no-underline"
                    href={`/search/properties?${queryParams ?? ""}`}>
                    <Button
                        className="capitalize text-black hover:!bg-black hover:border-black hover:text-white"
                        endIcon={<ArrowRightIcon />}>
                        { translate({ [LANGUAGE.PORTUGUESE]: "ver todas", [LANGUAGE.ENGLISH]: "View all" }) }
                    </Button>
                </Link>
            </div>
            <Swiper 
                breakpoints={breakpoints}
                className="flex flex-col-reverse">
                {
                    properties
                        .map(property => (
                            <SwiperSlide key={property.id}>
                                <Card
                                    property={property}
                                />
                            </SwiperSlide>
                        ))
                }
                { properties.length > 1 && <Controllers className="mb-4" /> }
            </Swiper>
        </section>
    )
}

export default RelatedProperties