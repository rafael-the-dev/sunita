import { Typography } from "@mui/material";
import classNames from "classnames";

import styles from "./styles.module.css";

type PropsType = {
    color: string;
    description: string | number;
    title: string;
}

const Highlight = ({ color, description, title }: PropsType) => {

    return (
        <div
            style={{ backgroundColor: color }}
            className={classNames(styles.container, "absolute px-3 py-4 rounded-md top-0 xl:py-6 md:relative")}>
            <Typography className={classNames(styles.content, 'font-normal text-base text-primary-800 w-fit')}>
                { title }<br/>
                <span className={classNames(styles.contentDescription, "font-bold opacity-60 text-xl xl:text-2xl")}>
                    { description } MT
                </span>
            </Typography>
        </div>
    );
};

export default Highlight;