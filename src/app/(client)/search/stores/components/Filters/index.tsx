import classNames from "classnames"

import styles from "./styles.module.css"

import {PROPERTY_TYPE} from "@/types/property"

import useSearchParams from "@/hooks/useSearchParams"

import Amenities from "./components/Amenities"
import PricingType from "@/views/Booking/components/Rooms/Filters/PricingType"
import Price from "@/components/shared/filters/components/Price"
import PropertyType from "./components/PropertyType"
import RoomType from "@/views/Booking/components/Rooms/Filters/RoomType"

const FiltersContainer = () => {
    const searchParams = useSearchParams()

    const propertyType = searchParams.get("type", PROPERTY_TYPE.BED_ROOM)

    const isBedRoomProperty = propertyType === PROPERTY_TYPE.BED_ROOM

    return (
        <div className={classNames(styles.container, `box-border flex flex-col gap-y-4 items-stretch overflow-y-auto`)}>
            <PropertyType />
            { isBedRoomProperty && <RoomType /> }
            <Amenities />
            <PricingType />
            <Price className="bg-white" />
        </div>
    )
}

export default FiltersContainer