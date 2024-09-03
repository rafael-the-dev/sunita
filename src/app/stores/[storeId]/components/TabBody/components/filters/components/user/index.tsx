import * as React from "react";
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography";

import { TableHeadersType } from "@/components/table/types";
import { UserType } from "@/types/user";

import { AnalyticsContext } from "@/context/AnalyticsContext";
import { AnalyticsFiltersContext } from "@/context/AnalyticsFilters";
import { LoginContext } from "@/context/LoginContext"

import useSearchParams from "@/hooks/useSearchParams";

import Input from "@/components/Textfield";
import Table from "@/components/shared/table";
import useDataMemo from "@/hooks/useDataMemo";

const UserFilter = () => {
    const { getData, setData } = React.useContext(AnalyticsFiltersContext);
    const { getUsers } = React.useContext(AnalyticsContext)
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

    const searchParams = useSearchParams();

    const usersList = getUsers()

    const data = React.useMemo(() => {
        const users = getData<UserType[]>("users");

        if(users.length > 0) return users;

        return usersList;
    }, [ getData, usersList ])

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