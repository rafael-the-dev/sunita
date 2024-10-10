
import Hidden from "@mui/material/Hidden"

import Button from "@/components/shared/button"
import Link from "@/components/link"
import List from "./components/List"
import Language from "./components/Language"
import MobileMenu from "./components/Menu"

const Header = () => {

    return (
        <header className="flex items-center justify-between px-[5%] py-2 md:py-3">
            <div className="flex items-center">
                <Hidden mdUp>
                    <MobileMenu />
                </Hidden>
                <Link
                    className="font-bold ml-3 no-underline text-black uppercase md:ml-0 md:text-lg" 
                    href="/">
                    Sunita
                </Link>
            </div>
            <Hidden mdDown>
                <nav>
                    <List />
                </nav>
            </Hidden>
            <div className="flex items-center gap-x-2">
                <Language />
                <Link href="/login">
                    <Button className="py-1">
                        Login
                    </Button>
                </Link>
            </div>
        </header>
    )
}

export default Header