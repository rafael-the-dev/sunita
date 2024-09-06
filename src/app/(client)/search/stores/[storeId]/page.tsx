"use client"

import { useEffect } from "react"
import classNames from "classnames"
import { useParams } from "next/navigation"
import Typography from "@mui/material/Typography"

import { PropertyType } from "@/types/property"

import useFetch from "@/hooks/useFetch"

import Button from "@/components/shared/button"
import Images from "./components/Images"
import Container from "@/components/Container/PublicRoute"

const PropertyContainer = () => {
    const { storeId } = useParams()

    const { data, loading, fetchData } = useFetch<PropertyType>(
        {
            autoFetch: false,
            url: `/api/stores/properties/${storeId}`
        }
    )

    useEffect(
        () => { 
            const controller = new AbortController()

            if(storeId) {
                fetchData(
                    {
                        path: `/api/stores/properties/${storeId}`,
                        signal: controller.signal
                    }
                )
            }

            return () => controller.abort()
        },
        [ fetchData, storeId ]
    )

    if(loading) return <Typography>Loading...</Typography>

    const property = data 

    return (
        <Container className="">
            <main className="bg-white box-border flex-col items-stretch px-6 py-4 w-full">
                <div className="flex items-center justify-between">
                    <Typography
                        className={classNames(`font-bold text-xl md:text-2xl xl:text-3xl`)}
                        component="h1">
                        { property?.name }
                    </Typography>
                    <Button
                        className="py-1">
                        Book
                    </Button>
                </div>
                <Images 
                    alt={property?.name}
                    src={property?.images}
                />
            </main>
        </Container>
    )
}

export default PropertyContainer


/**
 * "use client"

import { useContext } from "react"
import classNames from "classnames"
import { useParams } from "next/navigation"

import { TabType } from "@/context/FixedTabsContext/types"

import { FixedTabsContext } from "@/context/FixedTabsContext"
import { RoomsContextProvider } from "@/views/Booking/context"

import { Container, Provider } from "@/components/shared/FixedTabsContainer"
import Booking from "@/app/stores/[storeId]/rooms/components/Booking"
import Rooms from "@/app/stores/[storeId]/rooms/components/Rooms"

enum TABS_TYPE {
    BOOKING = "booking",
    ROOMS = "rooms",
    MORE = "more"
}

const tabs = [
    {
        id: TABS_TYPE.BOOKING,
        name: "Booking"
    },
    {
        id: TABS_TYPE.ROOMS,
        name: "Rooms"
    },
    {
        id: TABS_TYPE.MORE,
        name: "More"
    },
]

const RoomsPage = () => {
    const { getActiveTab } = useContext(FixedTabsContext)

    const activeTab = getActiveTab().id

    return (
        <div className={classNames("scrollable overflow-x-auto pt-6", { "px-2 md:px-4": activeTab !== TABS_TYPE.BOOKING })}>
            {
                {
                    [TABS_TYPE.BOOKING]: <Booking />,
                    [TABS_TYPE.ROOMS]: <Rooms />,
                    [TABS_TYPE.MORE]: <div></div>
                }[activeTab]
            }
        </div>
    )
}

const ProviderContainer = () => {
    const { storeId } = useParams()

    const url = `/api/stores/${storeId}`

    return (
        <RoomsContextProvider url={url}>
            <Provider tabs={tabs}>
                <RoomsPage />
            </Provider>
        </RoomsContextProvider>
    );
}

export default ProviderContainer;
 * 
 */