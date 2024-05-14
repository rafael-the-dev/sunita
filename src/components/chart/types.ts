import { MutableRefObject } from "react"
import { ChartSerieType, ChartXAxisType } from "@/types/chart";

export type PropsType = {
    series: ChartSerieType[];
    type: string;
    xAxis: MutableRefObject<ChartXAxisType>;
}