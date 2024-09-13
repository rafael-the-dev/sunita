import Button from "@mui/material/Button"
import classNames from "classnames"
import { Swiper, SwiperSlide } from 'swiper/react';

import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import useProperties from "@/hooks/useProperties"

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
    const { data } = useProperties(queryParams)
 
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
                    Properties Available Near You
                </Title>
                <Link
                    className="no-underline"
                    href={`/search/stores?${queryParams ?? ""}`}>
                    <Button
                        className="capitalize text-black hover:!bg-black hover:border-black hover:text-white"
                        endIcon={<ArrowRightIcon />}>
                        View all
                    </Button>
                </Link>
            </div>
            <Swiper 
                breakpoints={breakpoints}
                className="flex flex-col-reverse" >
                {
                    data
                        .map(property => (
                            <SwiperSlide key={property.id}>
                                <Card
                                    property={property}
                                />
                            </SwiperSlide>
                        ))
                }
                { data.length > 1 && <Controllers className="mb-4" /> }
            </Swiper>
        </section>
    )
}

export default RelatedProperties