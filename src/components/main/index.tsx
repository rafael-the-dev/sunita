import * as React from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

const Main = ({ children, className }: { children: React.ReactNode, className: string }) => (
    <main className={classNames(styles.main, `overflow-y-auto py-3 w-full`, className)}>
        { children }
    </main>
);

export default Main;