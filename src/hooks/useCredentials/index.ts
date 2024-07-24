import { useContext } from "react"

import { LoginContext } from "@/context/LoginContext"

const useCredentials = () => {
    const { credentials } = useContext(LoginContext)

    return {
        credentials
    }
}

export default useCredentials