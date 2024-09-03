import { useContext } from "react";
import Typography from "@mui/material/Typography";

import { LoginContext } from "@/context/LoginContext";


const LoadingContainer = () => {
    const { revalidatingToken } = useContext(LoginContext);

    return (
        <div className="fixed flex h-screen items-center justify-center left-0 top-0 w-screen">
            <Typography
                className="font-semibold text-lg"
                component="h1">
                Loading...
            </Typography>
        </div>        
    )
}

export default LoadingContainer;