import { useEffect, useRef } from "react";

import { COLLAPSE } from "@/app/stores/[storeId]/rooms/components/Booking/components/Chart/components/Filters/types"

import useSearchParams from "@/hooks/useSearchParams";

import Buttons from "./components/Buttons"
import Collapse from "@/components/collapse"
import XAxis from "./components/XAxis";
import YAxis from "./components/YAxis";

const list = Object.values(COLLAPSE)

const Filters = () => {
    const searchParams = useSearchParams();

    const onCloseRef = useRef<() => void>(null);
    const onOpenRef = useRef<() => void>(null);

    const selectedValue = searchParams.get("collapse", "") as COLLAPSE;

    useEffect(
        () => {
            const isIncluded = list.includes(selectedValue);

            if(isIncluded) onOpenRef.current?.();
            else onCloseRef.current?.();
        },
        [ selectedValue ]
    )

    return (
        <div className="px-3 sm:px-4">
            <Buttons />
            <Collapse 
                onClose={onCloseRef}
                onOpen={onOpenRef}>
                <div className="pt-2">
                    {
                        {
                            [COLLAPSE.X_AXIS]: <XAxis />,
                            [COLLAPSE.Y_AXIS]: <YAxis />,
                        }[selectedValue]
                    }
                </div>
            </Collapse>
        </div>
    )
}

export default Filters