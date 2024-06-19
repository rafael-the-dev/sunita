
import { ChangeEvent } from "react"

import useSearchParams from "@/hooks/useSearchParams"
import useFetch from "@/hooks/useFetch"

import Combobox from "@/components/shared/combobox"
import { UserType } from "@/types/user"

const UserFilter = ({ className }: { className?: string }) => {
    const { data, loading } = useFetch<UserType[]>({
        autoFetch: true,
        url: `/api/stores/12345/users`
    })

    const searchParams = useSearchParams()

    const value = searchParams.get("user", "")

    const getList = () => {
        if(!data) return []

        return data.map(user => ({ label: `${user.firstName} ${user.lastName}`, value: user.username }))
    }

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => searchParams.setSearchParam("user", e.target.value)

    if(loading) return <span>Loading...</span>

    return (
        <Combobox 
            className={className}
            list={getList()}
            onChange={changeHandler}
            value={value}
        />
    )
}

export default UserFilter