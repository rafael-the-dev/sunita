
import classNames from "classnames";

import styles from "./styles.module.css";

import DataShow from "./components/data-show"

const TabBody = () => {

    return (
        <div className={classNames("pt-4")}>
            <div className={classNames(styles.row, "bg-primary-100 mx-3")}>
                hello, rT
            </div>
            <div className="px-3">
                <DataShow />
            </div>
        </div>
    )
}

export default TabBody