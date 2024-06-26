import classNames from "classnames"
import Typography from "@mui/material/Typography"

type PropsType = {
    className?: string;
    label: string;
    value: number;
}

const Card = ({ className, label, value }: PropsType) => {

    return (
        <li className={classNames(className, `absolute bg-white box-border flex h-full items-center pl-4 top-0 xl:relative`)}>
            <Typography 
                className="flex flex-col marker:text-primary-700"
                component="h2">
                <Typography 
                    className="text-small"
                    component="span">
                    { label }
                </Typography>
                <Typography 
                    className="font-semibold text-lg"
                    component="span">
                    { value } MT
                </Typography>
            </Typography>
        </li>
    )
}

export default Card