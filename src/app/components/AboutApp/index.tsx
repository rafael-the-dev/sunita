
import classNames from "classnames"
import Typography from "@mui/material/Typography"

import styles from "./styles.module.css"

import { LANGUAGE } from "@/types/language"

import useLanguage from "@/hooks/useLanguage"

import Button from "@/components/shared/button"
import Link from "@/components/link"

const stepsList = [
    {
        description: {
            [LANGUAGE.ENGLISH]: "Use our location-based search to find the perfect spot near you",
            [LANGUAGE.PORTUGUESE]: "Use nossa pesquisa baseada em localização para encontrar o local perfeito perto de você"
        },
        title: {
            [LANGUAGE.ENGLISH]: "Search for properties",
            [LANGUAGE.PORTUGUESE]: "Pesquise por propriedades"
        }
    },
    {
        description: {
            [LANGUAGE.ENGLISH]: "Select your check-in and check-out dates to see availability in real-time",
            [LANGUAGE.PORTUGUESE]: "Selecione suas datas de check-in e check-out para ver a disponibilidade em tempo real"
        },
        title: {
            [LANGUAGE.ENGLISH]: "Choose your dates",
            [LANGUAGE.PORTUGUESE]: "Escolha suas datas"
        }
    },
    {
        description: {
            [LANGUAGE.ENGLISH]: "Book and pay securely in just a few clicks. Your place is ready for you!",
            [LANGUAGE.PORTUGUESE]: "Reserve e pague com segurança em apenas alguns cliques. Seu lugar está pronto para você!"
        },
        title: {
            [LANGUAGE.ENGLISH]: "Instant booking",
            [LANGUAGE.PORTUGUESE]: "Reserva instantânea"
        }
    },
]

const Step = ({ description, title }: typeof stepsList[0]) => {
    const { language } = useLanguage()

    return (
        <li className={classNames(styles.listItem, `flex gap-x-4 items-start sm:gap-x-0 relative sm:w-1/3 before:bg-gray-400 before:text-black 
            before:rounded-fll sm:flex-col sm:items-cener sm:gap-y-6`)}>
            <div className={classNames(styles.listItemContent, "sm:flex flex-col")}>
                <Typography
                    className="font-semibold text-xl"
                    component="h3">
                    { title[language] }
                </Typography>
                <Typography
                    className="mt-2 opacity-80 text-small"
                    component="p">
                    { description[language] }
                </Typography>
            </div>
        </li>
    )
}

const AboutApp = () => {
    const { translate } = useLanguage()

    return (
        <section className={classNames(styles.container, `bg-primary-800 bg-opacity-80 mt-16 overflow-hidden px-[5%] py-16
            relative text-white before:absolute sm:flex flex-col`)}>
            <Typography
                component="h2"
                className="font-bold text-3xl">
                { 
                    translate(
                        { 
                            [LANGUAGE.PORTUGUESE]: "Como funciona", 
                            [LANGUAGE.ENGLISH]: "How it works" 
                        }
                    ) 
                }
            </Typography>
            <Typography
                component="p"
                className="mt-3 opacity-85 text-small">
                { 
                    translate(
                        { 
                            [LANGUAGE.PORTUGUESE]: "Reserve a sua estadia perfeita em 3 passos simples", 
                            [LANGUAGE.ENGLISH]: "Book your perfect stay in 3 simple steps" 
                        }
                    ) 
                }
            </Typography>
            <ul className="flex flex-col gap-y-6 mt-8 sm:flex-row sm:gap-y-0 sm:gap-x-4 sm:mt-10">
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
                className="block mt-10 no-underline text-black sm:mt-16"
                href="/search/properties">
                <Button
                    className="!bg-white py-2 !text-black !hover:opacity-60">
                    { 
                        translate(
                            { 
                                [LANGUAGE.PORTUGUESE]: "Reserve agora", 
                                [LANGUAGE.ENGLISH]: "Book now" 
                            }
                        ) 
                    }
                </Button>
            </Link>
        </section>
    )
}

export default AboutApp