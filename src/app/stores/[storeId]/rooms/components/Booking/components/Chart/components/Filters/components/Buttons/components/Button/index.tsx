import { ReactNode, useCallback } from "react"
import Button from "@mui/material/Button";
import classNames from "classnames";

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { COLLAPSE } from "@/app/stores/[storeId]/rooms/components/Booking/components/Chart/components/Filters/types"

import useSearchParams from "@/hooks/useSearchParams";

type PropsType = {
    children: ReactNode;
    id: COLLAPSE;
}

const ButtonContainer = ({ children, id }: PropsType) => {
    const searchParams = useSearchParams()

    const selectedValue = searchParams.get("collapse", "")

    const selected = searchParams.isChecked(selectedValue, id);

    const clickHandler = useCallback(
        () => searchParams.toggleSearchParam("collapse", id),
        [ id, searchParams ]
    )

    return (
        <Button 
            className={classNames("mr-2", selected ? "bg-primary-400 rounded-xl text-white" : "text-black" )}
            endIcon={selected ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={clickHandler}>
            { children }
        </Button>
    );
};

export default ButtonContainer;