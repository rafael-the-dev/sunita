import * as React from "react";
import classNames from "classnames";

import styles from "./styles.module.css";

import Main from "@/components/main";
import RegisterProduct from "./components/register-product";
import SearchBox from "@/components/shared/product-search-box";

const Container = () => {

    return (
        <Main className="flex flex-col items-stretch justify-between">
            <div className="px-3">
                <form>
                    <SearchBox className="pr-2 rounded-md">
                        <SearchBox.Filters />
                        <SearchBox.Input 
                            className="grow"
                            placeholder="Insert product's name"
                        />
                    </SearchBox>
                </form>
                <div className={classNames(styles.body, `table-body`)}>

                </div>
            </div>
            <div className="flex justify-end px-3">
                <RegisterProduct />
            </div>
        </Main>
    );
};

export default Container;