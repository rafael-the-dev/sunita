import * as React from "react";
import classNames from "classnames";

import Filters from "./components/filters";
import Input from "./components/input";
import SearchIcon from "./components/search-icon";

type Props = {
    children: React.ReactNode;
    className?: string
}; 

const ProductSearchBox = ({ children, className }: Props) => {

    return (
        <div className={classNames(className, `border border-primary-500 border-solid flex items-center justify-between py-1`)}>
            { children }
        </div>
    );
};

ProductSearchBox.Filters = Filters;
ProductSearchBox.Input = Input;
ProductSearchBox.SearchIcon = SearchIcon;

export default ProductSearchBox;