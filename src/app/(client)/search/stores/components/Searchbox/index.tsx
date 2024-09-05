import * as React from "react"
import CircularProgress from "@mui/material/CircularProgress"

import { StoresContext } from "../../context"

import Filters from "../Filters"
import SearchBox from "@/components/shared/Search/Container"

const SearchBoxContainer = () => {
    const { loading, fetchProperties } = React.useContext(StoresContext)

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(loading) return;

        const params = new URLSearchParams(window.location.search);

        await fetchProperties(
            {
                path: `/api/stores/properties?${params.toString()}`
            }
        );
    }

    return (
        <form onSubmit={submitHandler}>
            <SearchBox
                classes={{
                    filters: {
                        button: "xl:hidden",
                        popover: {
                            paper: "",
                            root: "xl:hidden"
                        }
                    }
                }}
                filters={<Filters />}
                input={
                    {
                        placeholder: "Insert property's name"
                    }
                }
                submitButton={
                    <SearchBox.IconButton
                        disabled={loading}
                        type="submit">
                        { loading ? <CircularProgress size={18} /> : null}
                    </SearchBox.IconButton>
                    }
            />
        </form>
    )
}

export default SearchBoxContainer