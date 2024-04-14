'use client';

import { useContext } from "react";
import { useParams } from "next/navigation";

import Menu from "./components/menu";

const Container = () => {
    const { id } = useParams();

    return (
        <main>
            <div>
                <Menu />
            </div>
        </main>
    );
};

export default Container;