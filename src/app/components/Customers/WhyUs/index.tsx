
import classNames from "classnames"
import Typography from "@mui/material/Typography"

import InstantConfirmationIcon from '@mui/icons-material/CheckCircle';
import EasyToUseInterfaceIcon from '@mui/icons-material/Phonelink';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

import styles from "./styles.module.css"

import Image from "@/components/Image"
import Title from "@/app/(client)/search/properties/[propertyId]/components/Title"

const iconClasses = classNames(styles.listItemIcon, `text-white`)

const list = [
    {
        description: "Book from anywhere on any device",
        icon: <MobileFriendlyIcon className={iconClasses} />,
        title: "Mobile-Friendly"
    },
    {
        description: "No waiting—get instant booking confirmation right after payment",
        icon: <InstantConfirmationIcon className={iconClasses} />,
        title: "Instant Confirmation"
    },
    {
        description: "Need help? Our customer support team is always here for you",
        icon: <SupportAgentIcon className={iconClasses} />,
        title: "24/7 Support"
    },
    {
        description: "Clean, simple, and intuitive design means anyone can use it",
        icon: <EasyToUseInterfaceIcon className={iconClasses} />,
        title: "Easy-to-use interface"
    },
]

const ListItem = ({ description, icon, title }: typeof list[0]) => (
    <li className={classNames(styles.listItem, "flex gap-x-4 sm:flex-col sm:gap-x-0 sm:gap-y-4")}>
        <div className={classNames(styles.listItemIconContainer, "bg-gray-400 flex items-center justify-center rounded-full")}>
            { icon }
        </div>
        <div className={classNames(styles.listItemContent, "sm:fle flex-col items-center sm:text-ceter")}>
            <Typography
                className="font-semibold opacity-90"
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

const WhyUs = () => {
    return (
        <section className="mt-8 mb-24 px-[5%] relative">
            <div className={classNames(styles.container, "py-8 px-4 sm:px-6 sm:py-12")}>
                <Title>
                    Why Thousands of Travelers Trust Us
                </Title>
                <Typography
                    className="mt-3 opacity-85 text-small"
                    component="p">
                    Our platform is built with you in mind. We know you want fast, easy, and reliable booking options, 
                    whether you are traveling or looking for a short-term workspace.
                </Typography>
                <ul className="flex flex-col gap-y-6 mt-6 sm:flex-row sm:flex-wrap sm:justify-between sm:mt-10">
                    {
                        list.map((item, index) => (
                            <ListItem
                                { ...item }
                                key={index} 
                            />
                        ))
                    }
                </ul>
            </div>
        </section>
    )
}

export default WhyUs