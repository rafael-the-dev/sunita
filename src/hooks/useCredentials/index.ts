import { useContext } from "react"

import { LoginContext } from "@/context/LoginContext"

import { isClientUser } from "@/helpers/user"

const useCredentials = () => {
    const { credentials } = useContext(LoginContext)

    return {
        credentials,
        isClientUser: isClientUser(credentials?.user)
    }
}

export default useCredentials