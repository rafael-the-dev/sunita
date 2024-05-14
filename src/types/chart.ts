

export type ChartSerieType = {
    data: number[], 
    name: string
}

export type ChartSeriesType = {
    expenses: ChartSerieType[];
    profit: ChartSerieType[];
    total: ChartSerieType[];
};


export type ChartXAxisType = {
    categories: string[] | number[]
}