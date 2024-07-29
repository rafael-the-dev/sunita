import Filters from "../Filters"
import SearchBox from "@/components/shared/Search/Container"

const SearchBoxContainer = () => {
    return (
        <SearchBox
            classes={{
                filters: {
                    button: "lg:hidden",
                    popover: {
                        paper: "",
                        root: "lg:hidden"
                    }
                }
            }}
            filters={<Filters />}
        />
    )
}

export default SearchBoxContainer