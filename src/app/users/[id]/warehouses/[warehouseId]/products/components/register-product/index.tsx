
import { ProductFormContextProvider } from "./components/body/context"

import Body from "./components/body";

const ContextProvider = () => (
    <ProductFormContextProvider>
        <Body />
    </ProductFormContextProvider>
)

export default ContextProvider;
