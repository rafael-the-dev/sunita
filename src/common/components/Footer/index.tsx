
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';

import Link from "@/components/link"
import ListItem from "./components/ListItem"
import SocialMedia from "./components/SocialMedia"

const links = [
    {
        href: "/",
        label: "Home"
    },
    {
        href: "/about-us",
        label: "About us"
    },
    {
        href: "/pricing",
        label: "Pricing"
    }
]

const socialMedialLinks = [
    {
        href: "https://www.instagram.com/rafael_the_dev/?hl=en",
        label: <InstagramIcon />
    },
    {
        href: "https://linkedin.com/in/rafael-tivane/",
        icon: <FacebookIcon />
    },
    {
        href: "https://linkedin.com/in/rafael-tivane/",
        icon: <LinkedInIcon />
    },
    {
        href: "https://www.instagram.com/rafael_the_dev/?hl=en",
        icon: <XIcon />
    },
]


const Footer = () => {

    return (
        <footer
            className="bg-primary-800 pt-8 pb-4 px-[5%] text-white">
            <div className="flex flex-col sm:flex-row sm:justify-between">
                <div className="sm:grow">
                    <Link
                        className="no-underline text-white text-4xl !uppercase" 
                        href="/">
                        Sunita
                    </Link>
                    <ul className='flex flex-col gap-y-3 mt-6 sm:flex-row sm:gap-x-3 sm:gap-y-0'>
                        {
                            links.map(
                                ({ href, label }) => (
                                    <ListItem
                                        href={href}
                                        key={href}>
                                        { label }
                                    </ListItem>
                                )
                            )
                        }
                    </ul>
                </div>
                <ul className="flex flex-row gap-x-3 mt-12 sm:mt-0">
                    {
                        socialMedialLinks.map(
                            ({ href, icon }, index) => (
                                <SocialMedia
                                    href={href}
                                    key={index}>
                                    { icon }
                                </SocialMedia>
                            )
                        )
                    }
                </ul>
            </div>
            <div className="border-t border-solid border-gray-50 justify-center mt-6 opacity-80 py-6 flex">
                {
                    new Date(Date.now()).getFullYear()
                }
            </div>
        </footer>
    )
}

export default Footer