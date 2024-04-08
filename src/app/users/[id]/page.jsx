'use client';

import { useContext } from "react";
import { useParams } from "next/navigation";

const Container = () => {
    const { id } = useParams();

    return (
        <main>
            Hello, { id }
        </main>
    );
};

export default Container;