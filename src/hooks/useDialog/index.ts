import * as React from "react"

import useSearchParams from "@/hooks/useSearchParams"

const useDialog = (defaultDialogValue?: string) => {
    const searchParams = useSearchParams()

    const dialog = searchParams.get("dialog", defaultDialogValue)

    const changeDialog = React.useCallback(
        (dialog: string) => searchParams.setSearchParam("dialog", dialog),
        [ searchParams ]
    )

    return {
        dialog,
        changeDialog
    }
}

export default useDialog