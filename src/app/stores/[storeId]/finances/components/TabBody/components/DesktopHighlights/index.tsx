
import styles from "./styles.module.css"

import Card from "@/components/shared/Highlights/components/Card"
import Carousel from "@/components/shared/Highlights"

const Container = () => {

    return (
        <Carousel className="pt-4">
            <Card className={styles.card} label="Sales" value={25400} />
            <Card className={styles.card} label="Expenses" value={200} />
            <Card className={styles.card} label="Salaries" value={2400} />
            <Card className={styles.card} label="Profit" value={5000} />
            <Card className={styles.card} label="Extra" value={0} />
        </Carousel>
    )
}

export default Container