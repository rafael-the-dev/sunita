"use client"

import { useContext } from "react"
import classNames from "classnames"

import { TabType } from "@/context/FixedTabsContext/types"

import { FiltersContextProvider } from "@/context/FiltersContext"
import { FixedTabsContext } from "@/context/FixedTabsContext"
import { LoginContext } from "@/context/LoginContext"
import { RoomsContext, RoomsContextProvider } from "./context"

import { Container, Provider } from "@/components/shared/FixedTabsContainer"
import Booking from "./components/Booking"
import Rooms from "./components/Rooms"

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
                    [TABS_TYPE.ROOMS]: <Rooms />,
                    [TABS_TYPE.MORE]: <div></div>
                }[activeTab]
            }
        </div>
    )
}

const ProviderContainer = () => (
    <RoomsContextProvider>
        <Provider tabs={tabs}>
            <RoomsPage />
        </Provider>
    </RoomsContextProvider>
);

export default ProviderContainer;