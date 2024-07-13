"use client"

import { useContext } from "react"
import classNames from "classnames"

import { TabType } from "@/context/FixedTabsContext/types"

import { FixedTabsContext } from "@/context/FixedTabsContext"
import { Container, Provider } from "@/components/shared/FixedTabsContainer"
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
    const { getActiveTab } = useContext(FixedTabsContext)

    return (
        <div className={classNames("scrollable overflow-x-auto pt-6 px-2 md:px-4")}>
            {
                {
                    [TABS_TYPE.BOOKING]: <div></div>,
                    [TABS_TYPE.ROOMS]: <Rooms />,
                    [TABS_TYPE.MORE]: <div></div>
                }[getActiveTab().id]
            }
        </div>
    )
}

const ProviderContainer = () => (
    <Provider tabs={tabs}>
        <RoomsPage />
    </Provider>
);

export default ProviderContainer;