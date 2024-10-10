"use client"

import { MouseEvent, useCallback, useRef } from "react"
import IconButton from "@mui/material/IconButton"
import List from '@mui/material/List';
import ListItem from "@mui/material/MenuItem"
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import CheckIcon from '@mui/icons-material/Check';
import LanguageIcon from '@mui/icons-material/Language';

import { LANGUAGE } from "@/types/language"

import useLanguage from "@/hooks/useLanguage";

import Popover from "@/components/popover"

const list = [
    {
        label: {
            [LANGUAGE.ENGLISH]: "Portuguese",
            [LANGUAGE.PORTUGUESE]: "Português"
        },
        value: LANGUAGE.PORTUGUESE
    },
    {
        label: {
            [LANGUAGE.ENGLISH]: "English",
            [LANGUAGE.PORTUGUESE]: "Inglês"
        },
        value: LANGUAGE.ENGLISH
    }
]

const Language = () => {
    const { changeLanguage, language } = useLanguage()

    const onOpenRef = useRef<(e: MouseEvent<HTMLButtonElement>) => void>(null)
    const onCloseRef = useRef<() => void>(null)

    const clickHandler = useCallback(
        (language: LANGUAGE) => () => {
            changeLanguage(language);
            onCloseRef.current?.();
        },
        [ changeLanguage ]
    )

    const openHandler = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => onOpenRef.current?.(e),
        []
    )

    return (
        <>
            <IconButton
                aria-label="language"
                onClick={openHandler}>
                <LanguageIcon />
            </IconButton>
            <Popover
                id="language-popover"
                onClickRef={onOpenRef}
                onCloseRef={onCloseRef}>
                <List>
                    {
                        list.map(item => (
                            <ListItem 
                                key={item.value}>
                                <ListItemButton component="button" onClick={clickHandler(item.value)}>
                                    <ListItemText 
                                        className={ item.value !== language ? "text-primary-500" : "" } 
                                        primary={item.label[language]} />
                                    {
                                        item.value === language && (
                                            <ListItemIcon className="ml-4">
                                                <CheckIcon />
                                            </ListItemIcon>
                                        )
                                    }
                                </ListItemButton>
                            </ListItem>
                        ))
                    }
                </List>
            </Popover>
        </>
    )
}

export default Language