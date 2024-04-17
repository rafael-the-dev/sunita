
import Collapse from "../collapse";
import Input from "@/components/Input";

const Price = () => {

    return (
        <Collapse title="Price">
            <div className="flex items-center">
                <div className="flex flex-col">
                    <label htmlFor="min-price">Min</label>
                    <Input 
                        className="!border mt-2 !py-2"
                        id="min-price"
                        placeholder="Min"
                    />
                </div>
                <span className="mx-4 text-2xl">|</span>
                <div className="flex flex-col">
                    <label htmlFor="max-price">Max</label>
                    <Input 
                        className="!border mt-2 !py-2"
                        id="max-price"
                        placeholder="Max"
                    />
                </div>
            </div>
        </Collapse>
    );
};

export default Price;