"use client"

import { useContext } from "react"
import classNames from "classnames"

import { LANGUAGE } from "@/types/language"

import { FiltersContextProvider } from "@/context/FiltersContext"
import { FixedTabsContext } from "@/context/FixedTabsContext"
import { LoginContext } from "@/context/LoginContext"
import { RoomsContext, RoomsContextProvider } from "./context"

import useLanguage from "@/hooks/useLanguage"

import { Container, Provider } from "@/components/shared/FixedTabsContainer"
import Booking from "./components/Booking"
import Rooms from "./components/Rooms"

enum TABS_TYPE {
    BOOKING = "booking",
    ROOMS = "rooms"
}

const enTabs = [
    {
        id: TABS_TYPE.BOOKING,
        name: "Booking"
    },
    {
        id: TABS_TYPE.ROOMS,
        name: "Properties"
    }
]

const ptTabs = [
    {
        id: TABS_TYPE.BOOKING,
        name: "Reservas"
    },
    {
        id: TABS_TYPE.ROOMS,
        name: "Propriedades"
    }
]


const RoomsPage = () => {
    const { credentials } = useContext(LoginContext)
    const { getActiveTab } = useContext(FixedTabsContext)
    const { bookings } = useContext(RoomsContext)

    const activeTab = getActiveTab().id

    return (
        <div className={classNames("scrollable overflow-x-auto pt-6", { "px-2 md:px-4": activeTab !== TABS_TYPE.BOOKING })}>
            {
                {
                    [TABS_TYPE.BOOKING]: (
                        <FiltersContextProvider 
                            autoFetch={false}
                            list={bookings?.data?.data?.list}
                            refetchData={bookings.fetchData}
                            url={`/api/stores/${credentials?.user?.stores[0]?.storeId}/properties/bookings`}>
                            <Booking />
                        </FiltersContextProvider>
                    ),
                    [TABS_TYPE.ROOMS]: <Rooms />
                }[activeTab]
            }
        </div>
    )
}

const ProviderContainer = () => {
    const { language } = useLanguage()

    const tabs = language === LANGUAGE.ENGLISH ? enTabs : ptTabs

    return (
        <RoomsContextProvider>
            <Provider tabs={tabs}>
                <RoomsPage />
            </Provider>
        </RoomsContextProvider>
    );
}

export default ProviderContainer;