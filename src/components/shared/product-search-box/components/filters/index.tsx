'use client';

import * as React from "react";
import classNames from "classnames";

import IconButton from "@mui/material/IconButton";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import styles from "./styles.module.css";
import { CategoryType } from "@/types/category";

import { LoginContext } from "@/context/LoginContext";

import useFetch from "@/hooks/useFetch";

import Categories from "./components/categories";
import Popover from "@/components/popover";
import Price from "./components/price";

const FiltersContainer = () => {
    const { credentials } = React.useContext(LoginContext)

    const { data } = useFetch<CategoryType[]>(
        {
            url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/products/categories`
        }
    )

    const categories = data

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
                    <Categories list={categories} />
                    <Price />
                </div>
            </Popover>
        </>
    );
};

export default FiltersContainer;