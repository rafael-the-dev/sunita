
import classNames from "classnames";

import styles from "./styles.module.css"

import DataShow from "./components/data-show"
import Highlights from "./components/highlights";

const TabBody = () => {

    return (
        <div className={classNames(styles.root, "overflow-y-auto pt-4")}>
            <Highlights />
            <div className="px-3 md:mt-24">
                <DataShow />
            </div>
        </div>
    )
}

export default TabBody