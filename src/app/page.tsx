"use client"

import useProperties from "@/hooks/useProperties"

import AboutSunita from "./components/AboutApp"
import DiscoverProperties from "./components/Properties"
import Footer from "@/common/components/Footer"
import Header from "@/common/components/Header"
import MostSearchedCities from "./components/MostSearchedCities"
import RelatedProperties from "@/common/section/RelatedProperties"
import Testimonials from "./components/Customers/Testimonials"

const HomePageContainer = () => {
    //const { data } = useProperties()

    return (
        <div>
            <Header />
            <main>
                <DiscoverProperties />
                <RelatedProperties classes={{ root: "mt-12 px-[5%]" }}  />
                <AboutSunita />
                <Testimonials />
                <MostSearchedCities />
            </main>
            <Footer />
        </div>
    )
}

export default HomePageContainer