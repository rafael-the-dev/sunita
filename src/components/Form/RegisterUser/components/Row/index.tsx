import { ReactNode } from "react";

const Row = ({ children }: { children: ReactNode }) => (
    <div className="flex flex-wrap gap-y-4 sm:flex-nowrap sm:gap-y-0 sm:gap-x-4">
        { children }
    </div>
);

export default Row