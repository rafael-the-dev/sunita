
import classNames from "classnames"
import Typography from "@mui/material/Typography"

import styles from "./styles.module.css"

import Button from "@/components/shared/button"
import Link from "@/components/link"

const stepsList = [
    {
        description: "Use our location-based search to find the perfect spot near you",
        title: "Search for properties"
    },
    {
        description: "Select your check-in and check-out dates to see availability in real-time",
        title: "Choose your dates"
    },
    {
        description: "Book and pay securely in just a few clicks. Your place is ready for you!",
        title: "Instant booking"
    },
]

const Step = ({ description, title }: { description: string, title: string }) => (
    <li className={classNames(styles.listItem, `flex gap-x-4 items-start sm:gap-x-0 relative sm:w-1/3 before:bg-gray-400 before:text-black 
        before:rounded-fll sm:flex-col sm:items-center sm:gap-y-6`)}>
        <div className={classNames(styles.listItemContent, "sm:flex flex-col items-center sm:text-center")}>
            <Typography
                className="font-semibold text-xl"
                component="h3">
                { title }
            </Typography>
            <Typography
                className="mt-2 opacity-80 text-small"
                component="p">
                { description }
            </Typography>
        </div>
    </li>
)

const AboutApp = () => {

    return (
        <section className={classNames(styles.container, `bg-primary-800 bg-opacity-80 mt-16 overflow-hidden px-[5%] py-16
            relative text-white before:absolute sm:flex flex-col items-center`)}>
            <Typography
                component="h2"
                className="font-bold text-3xl">
                How it works
            </Typography>
            <Typography
                component="p"
                className="mt-3 opacity-85 text-small">
                Book your perfect stay in 3 simple steps
            </Typography>
            <ul className="flex flex-col gap-y-4 mt-6 sm:flex-row sm:gap-y-0 sm:gap-x-4 sm:mt-10">
                {
                    stepsList.map((item, index) => (
                        <Step
                            { ...item }
                            key={index} 
                        />
                    ))
                }
            </ul>
            <Link
                className="block mt-8 no-underline text-black sm:mt-16"
                href="/">
                <Button
                    className="!bg-white py-2 !text-black !hover:opacity-60">
                    Book now
                </Button>
            </Link>
        </section>
    )
}

export default AboutApp