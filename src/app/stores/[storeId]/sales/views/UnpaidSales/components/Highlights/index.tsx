import * as React from "react"
import currency from "currency.js"

import styles from "./styles.module.css"

import { SalesContext } from "../../../../context"

import Card from "@/components/shared/Highlights/components/Card"
import Carousel from "@/components/shared/Highlights"

const sum = (x: number, y: number) => currency(x).add(y).value

const Container = () => {
    const { unpaidSales } = React.useContext(SalesContext)

    const stats = unpaidSales
        ?.data
        ?.data
        ?.reduce(
            (prevAmounts, currentUnpaidSale) => {
                
                return {
                    remainingAmount: sum(prevAmounts.remainingAmount, currentUnpaidSale.remainingAmount),
                    total: sum(prevAmounts.total, currentUnpaidSale.total),
                    totalReceived: sum(prevAmounts.totalReceived, currentUnpaidSale.totalReceived)
                }
            },
            { total: 0, totalReceived: 0, remainingAmount: 0 }
        )

    return (
        <Carousel className="">
            <Card className={styles.card} label="Total" value={stats?.total ?? 0} />
            <Card className={styles.card} label="Total received" value={stats?.totalReceived ?? 0} />
            <Card className={styles.card} label="Total remaining" value={stats?.remainingAmount ?? 0} />
            <Card className={styles.card} label="Profit" value={5000} />
            <Card className={styles.card} label="Extra" value={0} />
        </Carousel>
    )
}

export default Container