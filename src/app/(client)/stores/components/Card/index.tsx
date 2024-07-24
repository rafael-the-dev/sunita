
import Typography from "@mui/material/Typography"

import Link from "@/components/link"

const Card = ({ name }) => {

    return (
        <div>
            <div>
                <Typography
                    component="h2"
                    className="font-semibold text-lg">
                    { name }
                </Typography>
            </div>
            <div></div>
        </div>
    )
}

export default Card