
import classNames from "classnames"

import styles from "./styles.module.css"

import UserPosition from "./components/Position"

const Container = () => {

    return (
        <div className={classNames(styles.root)}>
            <UserPosition />
        </div>
    )
}

export default Container