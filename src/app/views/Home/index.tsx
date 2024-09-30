"use client"

import AboutSunita from "../../components/AboutApp"
import DiscoverProperties from "../../components/Properties"
import Footer from "@/common/components/Footer"
import Header from "@/common/components/Header"
import Hero from "../../components/Hero"
import MostSearchedCities from "../../components/MostSearchedCities"
import RelatedProperties from "@/common/section/RelatedProperties"
import Testimonials from "../../components/Customers/Testimonials"
import WhyUs from "../../components/Customers/WhyUs"

const HomePageContainer = () => {

    return (
        <div>
            <Header />
            <main>
                <Hero />
                <DiscoverProperties />
                <RelatedProperties classes={{ root: "mt-12 px-[5%]" }}  />
                <AboutSunita />
                <Testimonials />
                <MostSearchedCities />
                <WhyUs />
            </main>
            <Footer />
        </div>
    )
}

export default HomePageContainer