import { ChangeEvent, useCallback } from "react"

import useQueryParams from "@/hooks/useSearchParams"

const useSearchParams = () => {
    const searchParams = useQueryParams()

    const changeHandler = useCallback(
        (key: string, set: (key: string, value: string | string[]) => void) => (e: ChangeEvent<HTMLInputElement>) => set(key, e.target.value),
        [ ]
    )

    return {
        searchParams,
        changeHandler
    }
}

export default useSearchParams