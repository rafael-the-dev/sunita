import Filters from "../Filters"
import SearchBox from "@/components/shared/Search/Container"

const SearchBoxContainer = () => {
    return (
        <SearchBox
            filters={<Filters />}
        />
    )
}

export default SearchBoxContainer