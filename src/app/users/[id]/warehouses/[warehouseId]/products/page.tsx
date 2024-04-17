import * as React from "react";


import SearchBox from "@/components/shared/product-search-box";

const Container = () => {

    return (
        <main className="flex flex-col items-stretch justify-between py-3 w-full">
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
            </div>
        </main>
    );
};

export default Container;