

import { COLLAPSE } from "@/app/stores/[storeId]/rooms/components/Booking/components/Chart/components/Filters/types"
import { LANGUAGE } from "@/types/language"

import useLanguage from "@/hooks/useLanguage"

import Button from "./components/Button"

const Buttons = () => {
    const { translate } = useLanguage()

    const list = [
        {
            label: translate({ [LANGUAGE.ENGLISH]: "X Axis", [LANGUAGE.PORTUGUESE]: "Eixo X"}),
            value: COLLAPSE.X_AXIS
        },
        {
            label: translate({ [LANGUAGE.ENGLISH]: "Y Axis", [LANGUAGE.PORTUGUESE]: "Eixo Y"}),
            value: COLLAPSE.Y_AXIS
        },
    ]

    return (
        <div className="flex items-stretch">
            {
                list.map(item => (
                    <Button
                        id={item.value}
                        key={item.value}>
                        { item.label }
                    </Button>
                ))
            }
        </div>
    )
}

export default Buttons