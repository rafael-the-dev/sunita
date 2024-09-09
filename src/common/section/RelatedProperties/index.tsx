import Button from "@mui/material/Button"
import classNames from "classnames"
import { Swiper, SwiperSlide } from 'swiper/react';

import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import useProperties from "@/hooks/useProperties"

import Card from "@/components/Card/Property"
import Link from "@/components/link"
import Title from "@/app/(client)/search/stores/[storeId]/components/Title"

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
            <div className="flex items-center justify-between mb-6">
                <Title>
                    Related properties
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
            <Swiper breakpoints={breakpoints} >
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
            </Swiper>
        </section>
    )
}

export default RelatedProperties