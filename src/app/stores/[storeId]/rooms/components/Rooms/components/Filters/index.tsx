import classNames from "classnames"

import styles from "./styles.module.css"

import Price from "@/components/shared/filters/components/Price"
import PricingType from "@/views/Booking/components/Rooms/Filters/PricingType"
import RoomType from "@/views/Booking/components/Rooms/Filters/RoomType"

const Filters = () => {

    return (
        <div className={classNames(styles.container, "box-border flex flex-col gap-y-4 items-stretch overflow-y-auto")}>
            <RoomType />
            <PricingType />
            <Price />
        </div>
    )
}

export default Filters