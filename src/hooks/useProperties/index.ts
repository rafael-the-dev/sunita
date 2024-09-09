
import { FetchResponseType } from "@/types"
import { PropertyType } from "@/types/property"

import useFetch from "../useFetch"

const useProperties = (queryParams?: string) => {
    const { data, fetchData, loading } = useFetch<FetchResponseType<PropertyType[]>>(
        {
            url: `/api/stores/properties?${queryParams}`
        }
    )

    return {
        data: data?.data ?? [],
        fetchData,
        loading
    }
}

export default useProperties