import { useMemo } from "react"
import classNames from "classnames"
import Typography from "@mui/material/Typography"

import styles from "./styles.module.css"

import { BaseStore } from "@/types/warehouse"

import Image from "@/components/Image"
import Link from "@/components/link"
import Status from "@/components/shared/Status"

const Card = ({ amenities, description, id, name, status }: BaseStore) => {
    const amenitiesList = useMemo(
        () => amenities
            .join(", "),
        [ amenities ]
    )

    return (
        <li className="border-b border-gray-200 border-solid pb-4 last:border-0">
            <Link
                className={classNames(styles.container, "flex flex-col gap-y-4 justify-between no-underline text-primary-700")}
                href={`/${id}`}>
                <div className="relative sm:flex items-stretch">
                    <Image 
                        alt={name}
                        className={styles.imageContainer}
                        src=""
                    />
                    <div className={classNames(styles.content, "flex flex-col grow gap-y-2")}>
                        <div className="flex justify-between">
                            <Typography
                                component="h2"
                                className="font-semibold text-lg">
                                { name }
                            </Typography>
                            <Status 
                                className={classNames(styles.status, `absolute !mr-0 right-0 top-0 z-10 sm:relative`)} 
                                status={status} 
                            />
                        </div>
                        <Typography
                            component="p"
                            className="text-small">
                            { description }
                        </Typography>
                        <div className="mt-4">
                            <Typography>
                                { amenitiesList }
                            </Typography>
                        </div>
                    </div>
                </div>
            </Link>
        </li>
    )
}

export default Card