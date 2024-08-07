import classNames from "classnames";

import styles from "./styles.module.css";
import { PropsTypes } from "./types";

import Collapse from "@/components/shared/collapse";
import DateFilter from "./components/Date";
import SearchField from "./components/SearchField";
import SubmitButton from "./components/submit-button";
import User from "./components/User"

const FiltersContainer = ({ children, className }: PropsTypes) => {
    return (
        <Collapse 
            classes={{ root: classNames(styles.filtersContainer, className, "border border-solid border-primary-200 grow overflow-y-auto md:ml-8")}} 
            title="Filters">
            <div>
                { children }
            </div>
        </Collapse>
    );
};

FiltersContainer.Date = DateFilter;
FiltersContainer.SubmitButton = SubmitButton;
FiltersContainer.SearchField = SearchField
FiltersContainer.User = User

export default FiltersContainer;