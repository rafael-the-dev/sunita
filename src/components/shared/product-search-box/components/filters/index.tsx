'use client';

import * as React from "react";
import classNames from "classnames";

import IconButton from "@mui/material/IconButton";

import FilterAltIcon from '@mui/icons-material/FilterAlt';

import styles from "./styles.module.css";

import Categories from "./components/categories";
import Popover from "@/components/popover";

const FiltersContainer = () => {

    const onClickHandlerRef = React.useRef<(e: React.MouseEvent<HTMLButtonElement>) => void | null>(null);

    const onClickHandler = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => onClickHandlerRef.current?.(e), []);

    return (
        <>
            <IconButton onClick={onClickHandler}>
                <FilterAltIcon />
            </IconButton>
            <Popover
                classes={{ root: "", paper: classNames(styles.paper)}}
                id="Product searcj filters"
                onClickRef={onClickHandlerRef}>
                <div className="py-3 px-2">
                    <Categories />
                    <Categories />
                    <Categories />
                    <Categories />
                </div>
            </Popover>
        </>
    );
};

export default FiltersContainer;