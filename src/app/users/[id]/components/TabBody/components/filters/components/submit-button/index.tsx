import { useContext } from "react"//:;

import useFech from "@/hooks/useFetch";
import useSearchParamsHook from "@/hooks/useSearchParams";

import Button from "@/components/shared/button";
import { AnalyticsContext } from "@/context/AnalyticsContext";

const mapValues = (key: string, list: string[]) => list.map(item => `${key}=${item}&`);

const SubmitButton = () => {
    const { fetchData, loading } = useContext(AnalyticsContext)
    const searchParams = useSearchParamsHook();

    const getSearchParams = () => {
        let queryParams = ""

        const users = searchParams.getAll("user");
        if(users.length > 0) queryParams += mapValues("user", users).join("");

        const products = searchParams.getAll("product");
        if(products.length > 0) queryParams += mapValues("product", products).join("");

        return queryParams;
    };

    /*const { data, loading, fetchData } = useFech({
        autoFetch: false,
        url: `/api/users/rafaeltivane/warehouses/12345/analytics?${getSearchParams()}`
    });*/

    const canISubmit = () => {
        const hasUsersSearchParam = searchParams.getAll("user").length > 0;
        const hasProductsSearchParam = searchParams.getAll("product").length > 0;

        return hasProductsSearchParam || hasUsersSearchParam;
    };

    // const controllerRef = useRef():;

    const submitHandler = async () => {
        // const queryParams = getSearchParams()
        // fetchData({})
        await fetchData({
            path: `/api/users/rafaeltivane/warehouses/12345/analytics?${getSearchParams()}`
        })
    };

    return (
        canISubmit() ? (
            <Button
                className="px-6 py-2"
                disabled={loading}
                onClick={submitHandler}>
                { loading ? "Loading..." : "Submit" }
            </Button>
        ) : <></> 
    );
};

export default SubmitButton;