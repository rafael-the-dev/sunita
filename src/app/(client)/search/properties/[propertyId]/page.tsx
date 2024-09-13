"use client"

import { useCallback, useContext, useEffect } from "react"
import classNames from "classnames"
import { useParams } from "next/navigation"
import Typography from "@mui/material/Typography"

import { BookingsResponseType } from "@/types/booking"
import { PropertyType } from "@/types/property"
import { TABS } from "./components/Tab/types"

import { AppContext } from "@/context/AppContext"

import useFetch from "@/hooks/useFetch"
import useSearchParams from "@/hooks/useSearchParams"

import Button from "@/components/shared/button"
import Bookings from "./components/Bookings"
import BookingForm from "./components/BookingForm"
import Container from "@/components/Container/PublicRoute"
import Images from "./components/Images"
import RelatedProperties from "@/common/section/RelatedProperties"
import Title from "./components/Title"
import Tab from "./components/Tab"

enum DIALOG {
    BOOKING_FORM = "booking-form"
}

const PropertyContainer = () => {
    const { fetchDataRef, setDialog } = useContext(AppContext)

    const { propertyId } = useParams()
    const searchParams = useSearchParams()

    const storeIdQueryParam = searchParams.get("store", "")
    const tab = searchParams.get("tab", TABS.BOOKINGS)
    const dialogQueryParam = searchParams.get("dialog", "")

    const { data, loading, fetchData } = useFetch<PropertyType>(
        {
            autoFetch: false,
            url: `/api/stores/properties/${propertyId}`
        }
    )

    const storeId = data?.owner

    const bookingsResponse = useFetch<BookingsResponseType>({
        autoFetch: false,
        url: `/api/stores/${data?.owner}/properties/bookings?property=${propertyId}`
    })
    
    const fetchBookings = bookingsResponse.fetchData;

    const openBookingFormDialog = useCallback(
        () => {
            fetchDataRef.current = fetchBookings;

            setDialog(
                {
                    header: {
                        title: "Booking form"
                    },
                    body: <BookingForm />,
                    payload: data
                }
            )
        },
        [ data, fetchBookings, fetchDataRef, setDialog ]
    )

    const clickHandler = useCallback(
        () => searchParams.setSearchParam("dialog", DIALOG.BOOKING_FORM),
        [ searchParams ]
    )

    useEffect(
        () => { 
            const controller = new AbortController()

            if(propertyId) {
                fetchData(
                    {
                        path: `/api/stores/properties/${propertyId}`,
                        signal: controller.signal
                    }
                )
            }

            return () => controller.abort()

        },
        [ fetchData, propertyId ]
    )

    useEffect(
        () => { 
            const controller = new AbortController()

            if(storeIdQueryParam || (propertyId && storeId)) {
                fetchBookings(
                    {
                        signal: controller.signal
                    }
                )
            }

            return () => controller.abort()
        },
        [ fetchBookings, propertyId, storeId, storeIdQueryParam ]
    )

    useEffect(
        () => {
            if(dialogQueryParam === DIALOG.BOOKING_FORM) openBookingFormDialog()
        },
        [ dialogQueryParam, openBookingFormDialog ]
    )

    if(loading) return <Typography>Loading...</Typography>

    const property = data; 

    return (
        <Container className="!bg-white">
            <main className="box-border flex-col items-stretch py-4 w-full">
                <div className="flex items-center justify-between">
                    <Typography
                        className={classNames(`font-bold text-xl md:text-2xl xl:text-3xl`)}
                        component="h1">
                        { property?.name }
                    </Typography>
                    <Button
                        className="py-1"
                        onClick={clickHandler}>
                        Book
                    </Button>
                </div>
                <Images 
                    alt={property?.name}
                    src={property?.images}
                />
                <div className="flex items-center mt-8 mb-4">
                    <Title className="opacity-90">
                        Amenities:
                    </Title>
                    <Typography
                        className="capitalize ml-3"
                        component="p">
                        { 
                            property
                                ?.amenities
                                ?.join(", ")
                        }
                    </Typography>
                </div>
                <div>
                    <ul className="flex items-stretch mb-8">
                        <Tab
                            id={TABS.BOOKINGS}>
                            Bookings
                        </Tab>
                        <Tab
                            id={TABS.DETAILS}>
                            Details
                        </Tab>
                    </ul>
                    {
                        tab === TABS.BOOKINGS ? <Bookings { ...bookingsResponse } storeId={property?.owner} /> : (
                        <div>
                            <div className="flex flex-col gap-y-2 items-stretch my-6">
                                <div className="flex flex-col">
                                    <Title className="opacity-90">
                                        Description
                                    </Title>
                                    <Typography
                                        className="text-small mt-3"
                                        component="p">
                                        { 
                                            Boolean(property?.description?.trim()) ? property.description : "No description"
                                        }
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        )
                    }
                </div>
                <RelatedProperties classes={{ root: "block mt-12"}} />
            </main>
        </Container>
    )
}

export default PropertyContainer