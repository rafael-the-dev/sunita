
import { ChangeEvent, useContext, useEffect } from "react"

import { LoginContext } from "@/context/LoginContext"

import useSearchParams from "@/hooks/useSearchParams"
import useFetch from "@/hooks/useFetch"
import { FetchDataFuncType } from "@/hooks/useFetch/types"
import { UserType } from "@/types/user"

import Combobox from "@/components/shared/combobox"

type PropsTypes = {
    className?: string;
    list?: UserType[];
    refetchUsers?: FetchDataFuncType;
}

const UserFilter = ({ className, list }: PropsTypes) => {
    const { credentials } = useContext(LoginContext);

    const { data, loading } = useFetch<UserType[]>({
        autoFetch: !Boolean(list),
        url: `/api/stores/${credentials?.user?.stores[0]?.storeId}/users`
    })

    const searchParams = useSearchParams();

    const value = searchParams.get("user", "");

    const getList = () => {
        const usersList = list ?? data;

        if(!usersList) return [];

        return usersList.map(user => ({ label: `${user.firstName} ${user.lastName}`, value: user.username }));
    }

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => searchParams.setSearchParam("user", e.target.value);

    if(loading) return <span>Loading...</span>;

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