
import classNames from "classnames"
import Typography from "@mui/material/Typography"

import styles from "./styles.module.css"

type PropsType = {
    author: string,
    description: string
}

const Testimonial = ({ author, description }: PropsType) => {

    return (
        <article className={classNames(styles.container, `bg box-border px-3 flex flex-col h-full justify-between py-4 
            rounded-lg relative before:absolute w-full`)}>
            <Typography 
                component="blockquote"
                className="grow opacity-90 text-[.9rem]">
                &#x275D;{ description }&#x275E;
            </Typography>
            <Typography 
                component="h3"
                className="font-semibold mt-2">
                { author }
            </Typography>
        </article>
    )
}

export default Testimonial