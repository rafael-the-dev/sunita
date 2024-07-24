import { useMemo } from "react"

import Typography from "@mui/material/Typography"

import { BaseStore } from "@/types/warehouse"

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
                className="flex flex-col gap-y-4 justify-between no-underline text-primary-700"
                href={`/${id}`}>
                <div className="flex gap-x-6">
                    <div className="flex flex-col gap-y-3">
                        <Typography
                            component="h2"
                            className="font-semibold text-lg">
                            { name }
                        </Typography>
                        <Typography
                            component="p"
                            className="">
                            { description }
                        </Typography>
                    </div>
                    <div>
                        <Status status={status} />
                    </div>
                </div>
                <div>
                    <Typography>
                        { amenitiesList }
                    </Typography>
                </div>
            </Link>
        </li>
    )
}

export default Card