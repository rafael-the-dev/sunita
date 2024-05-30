import { useContext  } from "react";
import { usePathname } from "next/navigation";
import Hidden from "@mui/material/Hidden";

import { LoginContext } from "@/context/LoginContext";

import Header from "@/components/shared/header";
import LoadingContainer from "./components/loading";
import Sidebar from "@/components/shared/side-bar";

const Container = ({ children }) => {
    const { revalidatingToken } = useContext(LoginContext);

    const pathname = usePathname();

    const isLoginPage = pathname === "/login";

    if(revalidatingToken) return <LoadingContainer />;


    return (
        <div className="md:flex">
            { 
                !isLoginPage && (
                    <Hidden mdDown>
                        <Sidebar />
                    </Hidden>
                )
            }
            <div className="grow">
                { !isLoginPage && <Header /> }
                { children }
            </div>
        </div>
    );

};

export default Container