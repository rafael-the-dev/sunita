

export type ChartSerieType = {
    data: number[], 
    name: string
}

export type ChartSeriesType = {
    profit: ChartSerieType[];
    total: ChartSerieType[];
};


export type ChartXAxisType = {
    categories: string[] | number[]
}