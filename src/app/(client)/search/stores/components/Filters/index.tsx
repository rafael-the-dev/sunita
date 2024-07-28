import classNames from "classnames"

import styles from "./styles.module.css"

import Amenities from "./components/Amenities"
import PricingType from "@/views/Booking/components/Rooms/Filters/PricingType"
import Price from "@/components/shared/filters/components/Price"
import RoomType from "@/views/Booking/components/Rooms/Filters/RoomType"

const FiltersContainer = () => {

    return (
        <div className={classNames(styles.container, `box-border flex flex-col gap-y-4 items-stretch overflow-y-auto`)}>
            <RoomType />
            <Amenities />
            <PricingType />
            <Price className="bg-white" />
        </div>
    )
}

export default FiltersContainer