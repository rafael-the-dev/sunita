import { ChangeEvent, ReactNode, useEffect, useRef } from "react"
import classNames from "classnames"
import IconButton from "@mui/material/IconButton"
import { IconButtonProps } from "@mui/material/IconButton"

import SendIcon from "@mui/icons-material/Send"


const SubmitButton = (props: IconButtonProps) => (
    <IconButton { ...props }>
        { props.children ?? <SendIcon /> }
    </IconButton>
)

export default SubmitButton