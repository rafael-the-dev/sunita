


import AddStock from "../add-stock";
import Button from "@/components/shared/button"
import DialogBody from "../register-product/components/body";
import Main from "@/components/main";
import RegisterProduct from "../register-product";
import SearchBox from "@/components/shared/product-search-box";
import Table from "@/components/shared/table";
import Link from "@/components/link";
import { StockContextProvider } from "@/context/StockContext";

const Footer = () => {

    return (
        <div className="flex flex-col items-stretch justify-end px-3 sm:flex-row">
            <Button 
                className="mb-3 sm:mb-0 sm:mr-3" 
                variant="outlined">
                Add stock
            </Button>
            <Link 
                className="mb-3 sm:mb-0 sm:mr-3"
                href="/users/rafaeltivane/warehouses/12345/products/stock">
                <Button className="w-full" variant="outlined">
                    View stock report
                </Button>
            </Link>
            <RegisterProduct />
        </div>
    )
}

export default Footer