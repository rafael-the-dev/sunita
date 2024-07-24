
import { useCallback } from "react"
import { TABS } from "../../components/Tab/types"

import useSearchParams from "@/hooks/useSearchParams"

const useTab = () => {
    const searchParams = useSearchParams()

    const tab = searchParams.get("tab", TABS.LIST)

    const isActive = useCallback(
        (testTab: TABS) => tab === testTab,
        [ tab ]
    )

    const setTab = useCallback(
        (newTab: TABS) => searchParams.setSearchParam("tab", newTab),
        [ searchParams ]
    )

    return {
        tab,
        isActive,
        setTab
    }
}

export default useTab