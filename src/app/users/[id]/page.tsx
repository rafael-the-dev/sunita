'use client';

import { useContext } from "react";
import { useParams } from "next/navigation";
import Hidden from "@mui/material/Hidden";

import Menu from "./components/menu";

const Container = () => {
    const { id } = useParams();

    return (
        <main>
            <div>
                <Hidden mdUp>
                    <Menu />
                </Hidden>
            </div>
        </main>
    );
};

export default Container;