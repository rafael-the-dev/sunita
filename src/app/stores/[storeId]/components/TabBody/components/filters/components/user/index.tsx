import * as React from "react";
import MenuItem from "@mui/material/MenuItem"

import { AnalyticsFiltersContext } from "@/context/AnalyticsFilters";
import { LoginContext } from "@/context/LoginContext"

import useFech from "@/hooks/useFetch";
import useSearchParams from "@/hooks/useSearchParams";

import Input from "@/components/Textfield";
import Table from "@/components/shared/table";
import { TableHeadersType } from "@/components/table/types";
import { Typography } from "@mui/material";
import { UserType } from "@/types/user";
import useDataMemo from "@/hooks/useDataMemo";

const UserFilter = () => {
    const { getData, setData } = React.useContext(AnalyticsFiltersContext);
    const { user } = React.useContext(LoginContext);

    const tableHeaders = React.useRef<TableHeadersType[]>([
        {
            label: "Selected",
            key: {
                value: "select_user"
            }
        },
        {
            label: "First name",
            key: {
                value: "firstName"
            }
        },
        {
            label: "Last name",
            key: {
                value: "lastName"
            }
        },
        {
            label: "Category",
            key: {
                value: "category"
            }
        }
    ])

    const searchParams = useSearchParams()//:;
    const fetchUsersResult = useFech<UserType[]>({ autoFetch: false, url: `/api/users` });
    const { fetchData, loading } = fetchUsersResult;

    const data = React.useMemo(() => {
        const users = getData<UserType[]>("users");

        if(users.length > 0) return users;

        return fetchUsersResult.data;
    }, [ fetchUsersResult, getData ])

    const filteredData = React.useMemo(() => {
        let searchKey = searchParams.get("search", "")

        if(typeof searchKey === "string" && searchKey.trim() && data) {
            searchKey = searchKey.toLocaleLowerCase();

            return data.filter(user => {
                const firstNameIncludesSearchKey =  user.firstName.toLowerCase().includes(searchKey);
                const lastNameIncludesSearchKey =  user.lastName.toLowerCase().includes(searchKey);
                const usernameIncludesSearchKey =  user.username.toLowerCase().includes(searchKey);

                return firstNameIncludesSearchKey || lastNameIncludesSearchKey || usernameIncludesSearchKey;
            });
        }

        return data;
    }, [ data, searchParams ])

    const changeHandler = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        searchParams.setSearchParam("search", e.target.value);
    }, [ searchParams ]);

    const checkboxChangeHandler = React.useCallback((row: UserType) => () => {
        searchParams.setSearchParams("user", row.username);
    }, [ searchParams ]);

    useDataMemo<UserType[]>({
        data: fetchUsersResult.data,
        fetchData,
        getData,
        key: "users",
        setData
    })

    return (
        <div>
            <Input 
                className="w-full"
                onChange={changeHandler}
                label="Insert username"
                // value={searchParams.get("search", "")}
            />
            <div>
                {
                    loading && (
                        <Typography>
                            Searching users...
                        </Typography>
                    )
                }
                {
                    data && (
                        <Table 
                            data={filteredData}
                            headers={tableHeaders}
                            onChange={checkboxChangeHandler}
                        />
                    )
                }
            </div>
        </div>
    );
};

export default UserFilter;