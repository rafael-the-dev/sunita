import Typography from "@mui/material/Typography";
import classNames from "classnames";

type PropsType = {
    classes: {
        root: string,
        value: string
    };
    text: string;
    value: number;
}

const TypographyContainer = ({ classes, text, value }: PropsType) => (
    <Typography className={classNames(classes.root)}>
        { text }
        <span className={classes.value}>
            { value } MT
        </span>
    </Typography>     
)

export default TypographyContainer