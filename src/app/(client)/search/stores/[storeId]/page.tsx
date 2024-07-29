"use client"

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