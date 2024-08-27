import { useContext } from "react"//:;

import { FiltersContext } from "@/context/FiltersContext"

import Button from "@/components/shared/button";

const SubmitButton = () => {
    const { fetchData, loading, url } = useContext(FiltersContext)

    const getSearchParams = () => {
        const params = new URLSearchParams(window.location.search)
     
        return params.toString();
    };
    
    const submitHandler = async () => {
        await fetchData({
            path: `${url}?${getSearchParams()}`
        })
    };

    return (
        <Button
            className="mt-4 px-6 py-2"
            disabled={loading}
            onClick={submitHandler}>
            { loading ? "Loading..." : "Submit" }
        </Button>
    );
};

export default SubmitButton;