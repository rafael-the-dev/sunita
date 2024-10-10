import { useCallback, useContext } from "react"

import { LANGUAGE } from "@/types/language"

import { AppContext } from "@/context/AppContext"

const useLanguage = () => {
    const { language } = useContext(AppContext)

    const translate = useCallback(
        (lib: Record<LANGUAGE, string>) => lib[language],
        [ language ]
    )

    return {
        language,
        translate
    }
}

export default useLanguage