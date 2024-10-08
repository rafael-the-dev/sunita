'use client' // Error components must be Client Components
 
import { useCallback, useEffect } from 'react'
import Typography from "@mui/material/Typography"
import classNames from "classnames"

import styles from "./error.module.css"

import Button from "@/components/shared/button"
import Footer from "@/common/components/Footer"
import Header from "@/common/components/Header"
import Image from "@/components/Image"
import Layout from "@/components/shared/layout"

type PropsType = {
    error: Error & { digest?: string }
    reset: () => void
}

const ErrorContainer = ({ error, reset }: PropsType) => {
    const clickHandler = useCallback(
        () => reset(),
        [ reset ]
    )

    useEffect(
        () => {
            // Log the error to an error reporting service
            console.error(error)
        }, 
        [ error ]
    )
 
    return (
        <Layout>
            <Header />
            <main className={classNames(styles.main, "flex flex-col items-center py-16 px-4")}>
                <Image 
                    alt="error image"
                    className={classNames(styles.imageContainer)}
                    src="/images/error/runtime-error.png"
                />
                <Typography
                    component="h2"
                    className="font-semibold text-2xl">
                    Something went wrong!
                </Typography>
                <Button
                    className="py-2"
                    onClick={clickHandler}>
                    Try again
                </Button>
            </main>
            <Footer />
        </Layout>
    )
}

export default ErrorContainer