
import Filters from "./components/Filters"
import Highlights from "./components/Highlights"
import Table from "./components/Table"

const UnpaidSalesContainer = () => {

    return (
        <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col items-stretch mb-8">
                <Highlights/> 
                <div className="flex flex-col gap-y-4 items-stretch mt-24">
                    <Filters />
                    <Table />
                </div>
            </div>
        </div>
    )
}

export default UnpaidSalesContainer