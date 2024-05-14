import Chart from "react-apexcharts";
import { PropsType } from "./types";

const ChartContainer = ({ series, type, xAxis }: PropsType) => {
    return (
        <Chart
            height="100%"
            options={{
                chart: {
                    stacked: false,
                },
                stroke: {
                    curve: "smooth",
                },
                xaxis: xAxis.current
            }}
            // @ts-ignore
            type={ type}
            series={series}
            width="100%"
        />
    );
};

export default ChartContainer;