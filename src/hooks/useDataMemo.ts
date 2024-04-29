import { useEffect, MutableRefObject } from "react"

type PropsType<T> = {
    data: T;
    fetchData: ({ signal }: { signal: AbortSignal }) => void;
    getData: <T extends Object>(key: string) => T;
    key: string;
    setData: <T extends Object>(key: string, data: T) => void;
}

const useDataMemo = <T>({ data, fetchData, getData, key, setData }: PropsType<T>) => {
    useEffect(() => {
        const controller = new AbortController();

        const data = getData<T>(key);

        if(Array.isArray(data) && data.length === 0) {
            fetchData({ signal: controller.signal });
        }

        return () => controller.abort();
    }, [ fetchData, getData, key ]);

    useEffect(() => {
        if(data) setData(key, data);
    }, [ data, key, setData ]);
};

export default useDataMemo;