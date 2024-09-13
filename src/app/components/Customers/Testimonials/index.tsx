import { Autoplay } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import Typography from "@mui/material/Typography"

import Controllers from "@/common/components/CarouselControllers"
import Title from "@/app/(client)/search/stores/[storeId]/components/Title"
import Testimonial from "@/common/components/Testimonial"

const testimonialsList = [
    {
        name: "Liam W.",
        testimonial: "I booked a cozy apartment for the weekend in minutes! The app is so easy to use, and the place was exactly what I needed.",
        location: "New York, USA"
    },
    {
        name: "Emily R.",
        testimonial: "As a freelancer, I love how quickly I can find nearby workspaces. I booked a quiet office for the day, and the experience was seamless!",
        location: "San Francisco, USA"
    },
    {
        name: "John M.",
        testimonial: "Finding a place near me has never been easier. The real-time availability feature saved me a lot of time, and I booked a place just around the corner!",
        location: "London, UK"
    },
    {
        name: "Sara T.",
        testimonial: "I needed a quick stay for a last-minute business trip, and the app helped me find an affordable place in no time. Super convenient!",
        location: "Berlin, Germany"
    },
    {
        name: "David S.",
        testimonial: "The entire booking process was a breeze, and I loved that I could see all the available properties nearby. Definitely using this again!",
        location: "Sydney, Australia"
    },
    {
        name: "Nina K.",
        testimonial: "Great app! I found a workspace for my remote work while traveling, and the booking experience was smooth and hassle-free.",
        location: "Paris, France"
    }
];
  

const Testimonials = () => {
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
        <section className="px-[5%] pt-16">
            <Title>
                What Our Happy Customers Say
            </Title>
            <Typography
                component="p"
                className="mt-3 mb-6 opacity-85 text-small">
                Do not just take our word for it—see what real users have to say about their booking experience.
            </Typography>
            <div>
                <Swiper 
                    autoplay
                    breakpoints={breakpoints}
                    className="flex flex-col-reverse"
                    modules={[ Autoplay ]}>
                    {
                        testimonialsList.map(
                            (item, index) => (
                                <SwiperSlide className="!h-auto" key={index}>
                                    <Testimonial
                                        author={item.name}
                                        description={item.testimonial}
                                        key={index} 
                                    />
                                </SwiperSlide>
                            )
                        )
                    }
                    { testimonialsList.length > 1 && <Controllers className="mb-4" /> }
                </Swiper>
            </div>
        </section>
    )
}

export default Testimonials