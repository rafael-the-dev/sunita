import classNames from "classnames";

import styles from "./styles.module.css";
import { PropsTypes } from "./types";

import Collapse from "@/components/shared/collapse";
import DateFilter from "./components/Date";
import SubmitButton from "./components/submit-button";

const FiltersContainer = ({ children }: PropsTypes) => {
    return (
        <Collapse 
            classes={{ root: classNames(styles.filtersContainer, "border border-solid border-primary-200 grow overflow-y-auto md:ml-8")}} 
            title="Filters">
            <div>
                { children }
            </div>
        </Collapse>
    );
};

FiltersContainer.Date = DateFilter;
FiltersContainer.SubmitButton = SubmitButton;

export default FiltersContainer;