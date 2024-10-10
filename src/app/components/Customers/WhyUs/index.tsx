
import classNames from "classnames"
import Typography from "@mui/material/Typography"

import InstantConfirmationIcon from '@mui/icons-material/CheckCircle';
import EasyToUseInterfaceIcon from '@mui/icons-material/Phonelink';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

import styles from "./styles.module.css"

import {LANGUAGE} from "@/types/language"

import useLanguage from "@/hooks/useLanguage";

import Title from "@/app/(client)/search/properties/[propertyId]/components/Title"

const iconClasses = classNames(styles.listItemIcon, `text-white`)

const list = [
    {
        description: {
            [LANGUAGE.ENGLISH]: "Book from anywhere on any device",
            [LANGUAGE.PORTUGUESE]: "Reserve de qualquer lugar em qualquer dispositivo",
        },
        icon: <MobileFriendlyIcon className={iconClasses} />,
        title: {
            [LANGUAGE.ENGLISH]: "Mobile-Friendly",
            [LANGUAGE.PORTUGUESE]: "Compatível com dispositivos móveis"
        }
    },
    {
        description: {
            [LANGUAGE.ENGLISH]: "No waiting—get instant booking confirmation right after payment",
            [LANGUAGE.PORTUGUESE]: "Sem espera – receba confirmação instantânea da reserva logo após o pagamento"
        },
        icon: <InstantConfirmationIcon className={iconClasses} />,
        title: {
            [LANGUAGE.ENGLISH]: "Instant Confirmation",
            [LANGUAGE.PORTUGUESE]: "Confirmação instantânea"
        }
    },
    {
        description: {
            [LANGUAGE.ENGLISH]: "Need help? Our customer support team is always here for you",
            [LANGUAGE.PORTUGUESE]: "Precisar de ajuda? Nossa equipe de suporte ao cliente está sempre aqui para ajudá-lo"
        },
        icon: <SupportAgentIcon className={iconClasses} />,
        title: {
            [LANGUAGE.ENGLISH]: "24/7 Support",
            [LANGUAGE.PORTUGUESE]: "Suporte 24 horas por dia, 7 dias por semana"
        }
    },
    {
        description: {
            [LANGUAGE.ENGLISH]: "Clean, simple, and intuitive design means anyone can use it",
            [LANGUAGE.PORTUGUESE]: "Design limpo, simples e intuitivo significa que qualquer pessoa pode usá-lo"
        },
        icon: <EasyToUseInterfaceIcon className={iconClasses} />,
        title: {
            [LANGUAGE.ENGLISH]: "Easy-to-use interface",
            [LANGUAGE.PORTUGUESE]: "Interface fácil de usar"
        }
    },
]

const ListItem = ({ description, icon, title }: typeof list[0]) => {
    const { language } = useLanguage()

    return (
        <li className={classNames(styles.listItem, "flex gap-x-4 sm:flex-col sm:gap-x-0 sm:gap-y-4")}>
            <div className={classNames(styles.listItemIconContainer, "bg-gray-400 flex items-center justify-center rounded-full")}>
                { icon }
            </div>
            <div className={classNames(styles.listItemContent, "sm:fle flex-col items-center sm:text-ceter")}>
                <Typography
                    className="font-semibold opacity-90"
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

const WhyUs = ({ className }: { className?: string }) => {
    const { translate } = useLanguage()

    return (
        <section className={classNames(className, "mt-8 mb-24 px-[5%] relative")}>
            <div className={classNames(styles.container, "py-8 px-4 sm:px-6 sm:py-12")}>
                <Title>
                    { 
                        translate(
                            { 
                                [LANGUAGE.PORTUGUESE]: "Porquê milhares de viajantes confiam em nós?", 
                                [LANGUAGE.ENGLISH]: "Why Thousands of Travelers Trust Us?" 
                            }
                        ) 
                    }
                </Title>
                <Typography
                    className="mt-3 opacity-85 text-small"
                    component="p">
                    { 
                        translate(
                            { 
                                [LANGUAGE.PORTUGUESE]: `Nossa plataforma foi construída pensando em você. Sabemos que você 
                                    quer rápido, fácil, e opções de reserva confiáveis, esteja você viajando ou procurando 
                                    um espaço de trabalho de curto prazo.`, 
                                [LANGUAGE.ENGLISH]: `Our platform is built with you in mind. We know you want fast, easy, 
                                    and reliable booking options, whether you are traveling or looking for a short-term workspace.`
                            }
                        ) 
                    }
                    
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