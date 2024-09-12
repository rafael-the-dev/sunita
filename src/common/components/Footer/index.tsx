
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';

import Link from "@/components/link"
import ListItem from "./components/ListItem"
import SocialMedia from "./components/SocialMedia"
import Title from "./components/Title"

const quickLinks = [
    {
        href: "/",
        label: "Home"
    },
    {
        href: "/",
        label: "About us"
    },
    {
        href: "/",
        label: "Pricing"
    }
]

const supportLinks = [
    {
        href: "/",
        label: "Help center"
    },
    {
        href: "/",
        label: "Privacy policy"
    },
    {
        href: "/",
        label: "Terms of service"
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
            className="bg-primary-800 pt-8 pb-4 px-[5%] text-white md:pt-12">
            <div className="flex flex-col sm:flex-row sm:justify-between">
                <div className="sm:grow sm:flex">
                    <Link
                        className="no-underline text-white text-4xl !uppercase" 
                        href="/">
                        Sunita
                    </Link>
                    <div className="flex flex-col gap-y-4 mt-8 sm:mt-0 sm:flex-row sm:gap-y-0 sm:ml-6 md:ml-12">
                        <div className="flex flex-col">
                            <Title>Quick links</Title>
                            <ul className='flex flex-col gap-y-3 mt-6'>
                                {
                                    quickLinks.map(
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
                        <div className="flex flex-col sm:ml-6 md:ml-12">
                            <Title>Support links</Title>
                            <ul className='flex flex-col gap-y-3 mt-6'>
                                {
                                    supportLinks.map(
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
                    </div>
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
            <div className="border-t border-solid border-gray-50 justify-center mt-10 opacity-80 py-6 flex">
                {
                    new Date(Date.now()).getFullYear()
                }
            </div>
        </footer>
    )
}

export default Footer