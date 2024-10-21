
import Chart from "./components/Chart"
import Filters from "./components/Filters"

const ChartContainer = () => {
    return (
        <div className="px-3">
            <Filters />
            <Chart />
        </div>
    )
}

export default ChartContainer