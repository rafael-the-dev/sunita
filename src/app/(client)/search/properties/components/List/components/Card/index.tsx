"use client"

import { useMemo } from "react"
import classNames from "classnames"
import Chip from "@mui/material/Chip"
import Typography from "@mui/material/Typography"

import styles from "./styles.module.css"

import { LANGUAGE } from "@/types/language"
import { PropertyType } from "@/types/property"

import useLanguage from "@/hooks/useLanguage"

import Button from "@/components/shared/button"
import Image from "./components/Image"
import Link from "@/components/link"
import Status from "@/components/shared/Status"

const Card = ({ amenities, bedroom, description, id, images, name, price, status }: PropertyType) => {
    const { translate } = useLanguage()

    const amenitiesList = useMemo(
        () => amenities
            .join(", "),
        [ amenities ]
    )

    return (
        <li className="border-b border-gray-200 border-solid pb-6 last:border-0">
            <div
                className={classNames(styles.container, "flex flex-col gap-y-4 justify-between no-underline text-primary-700")}>
                <div className="relative sm:flex items-stretch">
                    <Image 
                        alt={name}
                        src={images}
                    />
                    <div className={classNames(styles.content, "flex flex-col grow gap-y-2 justify-between")}>
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
                        <div className="flex flex-col gap-y-3 mt-2 sm:gap-y-2">
                            {
                                Boolean(bedroom) && (
                                    <Typography
                                        className="capitalize font-bold"
                                        component="h3">
                                        { bedroom.type }
                                    </Typography>
                                )
                            }
                            <Typography
                                className="capitalize"
                                component="p">
                                { amenitiesList }
                            </Typography>
                            <div className={classNames(styles.footer, `flex flex-col gap-y-6 justify-between w-full sm:flex-row sm:gap-y-0 sm:items-end xl:flex-col
                                xl:gap-y-6 xl:items-start xl:mt-0`)}>
                                <div className='flex items-center gap-x-3'>
                                    <Chip label={`${price.night}Mt/n`} />
                                    <Chip className="bg-primary-500 text-white" label={`${price.hourly}Mt/h`} />
                                    <Chip label={`${price.daily}Mt/d`} />
                                </div>
                                <Link
                                    className="" 
                                    href={`./properties/${id}`}>
                                    <Button
                                        className="py-2 sm:py-1">
                                        {
                                            translate(
                                                {
                                                    [LANGUAGE.ENGLISH]: "View details",
                                                    [LANGUAGE.PORTUGUESE]: "Ver detalhes"
                                                }
                                            )
                                        }
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    )
}

export default Card