import { useContext } from "react"//:;

import { FiltersContext } from "@/context/FiltersContext"
import useSearchParamsHook from "@/hooks/useSearchParams";

import Button from "@/components/shared/button";

const mapValues = (key: string, list: string[]) => list.map(item => `${key}=${item}&`);

const SubmitButton = () => {
    const { fetchData, loading, url } = useContext(FiltersContext)

    const searchParams = useSearchParamsHook();

    const getSearchParams = () => {
        let queryParams = ""

        const users = searchParams.getAll("user");
        if(users.length > 0) queryParams += mapValues("user", users).join("");

        const products = searchParams.getAll("product");
        if(products.length > 0) queryParams += mapValues("product", products).join("");

        const startDate = searchParams.get("start-date", "")
        if(startDate) queryParams += `start-date=${startDate}&`

        const endDate = searchParams.get("end-date", "");
        if(startDate && endDate) queryParams += `end-date=${endDate}`

        return queryParams;
    };

    const hasSearchParams = () => {
        const hasUsersSearchParam = searchParams.getAll("user").length > 0;
        const hasProductsSearchParam = searchParams.getAll("product").length > 0;
        const hasStartDate = searchParams.get("start-date", "");
        const hasEndDate = searchParams.get("end-date", "") && hasStartDate;

        return hasProductsSearchParam || hasUsersSearchParam || hasStartDate || hasEndDate;
    };

    const canISubmit = hasSearchParams();

    const submitHandler = async () => {
        await fetchData({
            ...( canISubmit ? { path: `${url}?${getSearchParams()}` } : {})
        })
    };

    return (
        <Button
            className="mt-4 px-6 py-2"
            disabled={loading}
            onClick={submitHandler}>
            { loading ? "Loading..." : ( canISubmit ? "Submit" : "Refresh" )}
        </Button>
    );
};

export default SubmitButton;