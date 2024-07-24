import classNames from "classnames"

import styles from "./styles.module.css"

import Amenities from "./components/Amenities"
import RoomType from "./components/RoomType"

const FiltersContainer = () => {

    return (
        <div className={classNames(styles.container, `overflow-y-auto`)}>
            <RoomType />
            <Amenities />
        </div>
    )
}

export default FiltersContainer