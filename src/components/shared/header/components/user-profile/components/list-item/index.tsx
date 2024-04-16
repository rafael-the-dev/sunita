import * as React from "react";
import classNames from "classnames";
import Button from "@mui/material/Button";
// import { ButtonOwnProps } from "@mui/material/Button/Button";

import Link from "@/components/link";

type Props = {
    href?: string,
    icon: React.ReactNode,
    label: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
};

const ListItem = ({ icon, href, label, onClick }: Props) => {

    const children = (
        <Button className="p-0 text-current" onClick={onClick}>
            { icon }
            <span className="ml-2">{ label }</span>
        </Button>
    );

    return (
        <li
            className={classNames('flex items-center py-3 px-3 hover-secondary-button')}>
            {
                href ? <Link href={href}>{ children }</Link> : children
            }
        </li>
    );
};

export default ListItem;